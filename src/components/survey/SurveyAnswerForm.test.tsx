/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import type { DraftAnswers } from '../../hooks/useSurveyDraft';
import type { SurveyQuestion } from '../../models/survey';

import {
  isBaselineCorrectionQuestion,
  shouldShowBaselineCorrectionInput,
} from './per-friend/baselineCorrection';
import { PerFriendCard } from './per-friend/PerFriendCard';
import { getInitialSurveyPageIndex, groupQuestionsIntoPages } from './surveyPageResume';
import { getVisibleSurveyQuestions } from './surveyQuestionVisibility';
import { buildSurveyAnswerPayload } from './surveySubmitPayload';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { value?: number } | string) => {
      if (key === 'baseline_label') return 'When you added them:';
      if (key === 'baseline_closeness_value') return `${(options as { value?: number }).value}/5`;
      if (key === 'baseline_change_button') return 'Yeah, I should modify that';
      if (key === 'baseline_change_hint') {
        return `Your earlier rating was ${
          (options as { value?: number }).value
        }/5. If that was a genuine mistake, you can fix it here. It won't count against your participation.`;
      }
      if (key === 'baseline_correction_prompt') return 'What should the earlier rating have been?';
      if (typeof options === 'string') return options;
      return key;
    },
  }),
}));

jest.mock(
  '@design-system',
  () => {
    const React = jest.requireActual<typeof import('react')>('react');
    function MockLayout({ children, ...props }: { children?: ReactNode }) {
      const domProps = { ...(props as Record<string, unknown>) };
      ['alignItems', 'bgColor', 'flex', 'gap', 'justifyContent', 'ph', 'pv', 'w'].forEach((key) => {
        delete domProps[key];
      });
      return React.createElement('div', domProps, children);
    }
    function MockTypo({ children }: { children?: ReactNode }) {
      return React.createElement('span', null, children);
    }

    return {
      Colors: {
        BLACK: '#000',
        DARK_GRAY: '#555',
        LIGHT: '#f8f8f8',
        LIGHT_GRAY: '#ddd',
        MEDIUM_GRAY: '#999',
        PRIMARY: '#8700ff',
        WHITE: '#fff',
      },
      Layout: {
        FlexCol: MockLayout,
        FlexRow: MockLayout,
      },
      Typo: MockTypo,
    };
  },
  { virtual: true },
);

jest.mock(
  '@i18n/index',
  () => ({
    __esModule: true,
    default: { language: 'en' },
  }),
  { virtual: true },
);

const question = (
  overrides: Partial<SurveyQuestion> & Pick<SurveyQuestion, 'id' | 'order' | 'type'>,
): SurveyQuestion =>
  ({
    slug: '',
    prompt_en: '',
    prompt_ko: '',
    description_en: '',
    description_ko: '',
    placeholder_en: '',
    placeholder_ko: '',
    low_label_en: '',
    low_label_ko: '',
    high_label_en: '',
    high_label_ko: '',
    na_option_en: '',
    na_option_ko: '',
    content_en: '',
    content_ko: '',
    required: true,
    min_length: 0,
    reverse_scored: false,
    conditional_display: null,
    slider_min_value: null,
    slider_max_value: null,
    options: [],
    ...overrides,
  } as SurveyQuestion);

describe('getInitialSurveyPageIndex', () => {
  it('starts on a display-only intro when no actual answers are saved', () => {
    const questions = [
      question({ id: 1, order: 1, type: 'display_only', content_en: 'Read this first.' }),
      question({ id: 2, order: 2, type: 'single_choice' }),
    ];

    expect(getInitialSurveyPageIndex(questions, {})).toBe(0);
  });

  it('resumes to the first unanswered question after a real answer exists', () => {
    const questions = [
      question({ id: 1, order: 1, type: 'display_only', content_en: 'Read this first.' }),
      question({ id: 2, order: 2, type: 'single_choice' }),
      question({ id: 3, order: 3, type: 'free_text' }),
    ];
    const answers: DraftAnswers = { 2: 'habitual_platform' };

    expect(getInitialSurveyPageIndex(questions, answers)).toBe(2);
  });

  it('backs up to attached display-only instructions when the target answer has a draft', () => {
    const questions = [
      question({ id: 1, order: 1, type: 'display_only', content_en: 'Read this first.' }),
      question({ id: 2, order: 2, type: 'single_choice' }),
    ];
    const answers: DraftAnswers = { 2: 'instagram' };

    expect(getInitialSurveyPageIndex(questions, answers)).toBe(0);
  });

  it('backs up to section instructions before the first unanswered question', () => {
    const questions = [
      question({ id: 1, order: 1, type: 'single_choice' }),
      question({ id: 2, order: 2, type: 'display_only', content_en: 'Next section.' }),
      question({ id: 3, order: 3, type: 'single_choice' }),
    ];
    const answers: DraftAnswers = { 1: 'answered' };

    expect(getInitialSurveyPageIndex(questions, answers)).toBe(1);
  });
});

describe('groupQuestionsIntoPages', () => {
  it('keeps feature rating and enjoy/dislike follow-ups on one page', () => {
    const questions = [
      question({
        id: 1,
        order: 1,
        type: 'likert_5',
        slug: 'goal3_feat_emoji',
      }),
      question({
        id: 2,
        order: 2,
        type: 'free_text',
        slug: 'goal3_feat_emoji_enjoy',
      }),
      question({
        id: 3,
        order: 3,
        type: 'free_text',
        slug: 'goal3_feat_emoji_dislike',
      }),
      question({ id: 4, order: 4, type: 'likert_5', slug: 'satisfaction' }),
    ];

    const pages = groupQuestionsIntoPages(questions);

    expect(pages).toHaveLength(2);
    expect((pages[0] as { kind: string }).kind).toBe('feature_block');
    expect((pages[0] as { questions: SurveyQuestion[] }).questions.map((q) => q.slug)).toEqual([
      'goal3_feat_emoji',
      'goal3_feat_emoji_enjoy',
      'goal3_feat_emoji_dislike',
    ]);
    expect((pages[1] as { kind: string }).kind).toBe('single');
  });
});

describe('getVisibleSurveyQuestions', () => {
  it('hides questions with the deprecated never-shown sentinel', () => {
    const questions = [
      question({ id: 1, order: 1, type: 'likert_5', slug: 'goal2_feat_browse' }),
      question({
        id: 2,
        order: 2,
        type: 'likert_5',
        slug: 'goal2_feat_chatstatus',
        conditional_display: {
          depends_on: '__deprecated_feature_never_shown__',
          show_when_value: '__show__',
        },
      }),
      question({
        id: 3,
        order: 3,
        type: 'free_text',
        slug: 'goal2_feat_chatstatus_enjoy',
        conditional_display: {
          depends_on: '__deprecated_feature_never_shown__',
          show_when_value: '__show__',
        },
      }),
    ];

    expect(getVisibleSurveyQuestions(questions, {}).map((q) => q.slug)).toEqual([
      'goal2_feat_browse',
    ]);
  });
});

describe('buildSurveyAnswerPayload', () => {
  it('submits each per-friend answer once per target user', () => {
    const perFriendQuestion = question({
      id: 11,
      order: 2,
      type: 'per_friend_likert_5',
      slug: 'phase1_friend_closeness_current',
      prompt_en: 'How close do you feel right now?',
      low_label_en: 'Not close',
      high_label_en: 'Very close',
    });
    const questions: SurveyQuestion[] = [
      {
        ...perFriendQuestion,
        target_user_id: 101,
        target_user_username: 'alice',
        baseline_closeness: 3,
      },
      {
        ...perFriendQuestion,
        target_user_id: 102,
        target_user_username: 'bob',
        baseline_closeness: 4,
      },
    ];
    const answers: DraftAnswers = { 11: { 101: 4, 102: 2 } };

    expect(buildSurveyAnswerPayload(questions, answers)).toEqual([
      { question_id: 11, target_user_id: 101, value: 4 },
      { question_id: 11, target_user_id: 102, value: 2 },
    ]);
  });
});

describe('baseline correction gate', () => {
  it('does not render the standalone baseline summary row', () => {
    const currentQuestion = question({
      id: 11,
      order: 2,
      type: 'per_friend_likert_5',
      slug: 'phase1_friend_closeness_current',
      prompt_en: 'How close do you feel right now?',
    });
    const correctionQuestion = question({
      id: 12,
      order: 3,
      type: 'per_friend_likert_5',
      slug: 'phase1_friend_closeness_corrected_baseline',
    });

    render(
      <MemoryRouter>
        <PerFriendCard
          friendId={101}
          friendUsername="adoor_2"
          baselineCloseness={1}
          questions={[currentQuestion, correctionQuestion]}
          getValue={() => undefined}
          setValue={() => undefined}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByText('When you added them:')).not.toBeInTheDocument();
    expect(screen.queryByText('1/5')).not.toBeInTheDocument();
    expect(screen.queryByText(/Other/)).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "Your earlier rating was 1/5. If that was a genuine mistake, you can fix it here. It won't count against your participation.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Yeah, I should modify that')).toBeInTheDocument();
  });

  it('hides the correction picker until the user explicitly opts in', () => {
    const correctionQuestion = question({
      id: 12,
      order: 3,
      type: 'per_friend_likert_5',
      slug: 'phase1_friend_closeness_corrected_baseline',
    });

    expect(isBaselineCorrectionQuestion(correctionQuestion)).toBe(true);
    expect(
      shouldShowBaselineCorrectionInput({
        question: correctionQuestion,
        hasBaseline: true,
        correctionRequested: false,
        existingValue: undefined,
      }),
    ).toBe(false);
    expect(
      shouldShowBaselineCorrectionInput({
        question: correctionQuestion,
        hasBaseline: true,
        correctionRequested: true,
        existingValue: undefined,
      }),
    ).toBe(true);
  });
});
