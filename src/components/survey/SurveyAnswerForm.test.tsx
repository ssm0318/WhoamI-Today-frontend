/* eslint-env jest */

import type { DraftAnswers } from '../../hooks/useSurveyDraft';
import type { SurveyQuestion } from '../../models/survey';

import { getInitialSurveyPageIndex } from './surveyPageResume';
import { buildSurveyAnswerPayload } from './surveySubmitPayload';

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
