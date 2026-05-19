/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import useSWR from 'swr';

import type { SurveyIndexEntry, SurveyIndexResponse } from '@models/survey';

import SurveysIndex from './SurveysIndex';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { date?: string; progress?: number }) => {
      if (key.startsWith('cadence.')) return key.replace('cadence.', '');
      if (key === 'was_due') return `Was due ${options?.date}`;
      if (key === 'draft_progress') return `${options?.progress}% done`;
      if (key === 'bucket_todo') return 'To-do';
      if (key === 'bucket_late_but_accepted') return 'Late but accepted';
      if (key === 'bucket_completed') return 'Completed';
      if (key === 'daily_archive_row') return 'Daily check-ins collapsed';
      if (key === 'high_priority') return 'High priority';
      if (key === 'check_results') return 'Check Results';
      return key;
    },
  }),
}));

jest.mock('swr');

jest.mock('../Root', () => ({
  MainScrollContainer: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

jest.mock(
  '@components/sub-header/SubHeader',
  () => ({
    __esModule: true,
    default: ({ title }: { title: string }) => <div>{title}</div>,
  }),
  { virtual: true },
);

jest.mock(
  '@components/survey/DeadlineBadge',
  () => ({
    DeadlineBadge: ({ windowEnd }: { windowEnd: string | null }) =>
      windowEnd ? (
        <span>
          {windowEnd === '2026-05-24'
            ? 'Due Sun'
            : windowEnd === '2026-05-19'
            ? 'Due tomorrow'
            : 'Due today'}
        </span>
      ) : null,
  }),
  { virtual: true },
);

jest.mock(
  '@constants/layout',
  () => ({
    TITLE_HEADER_HEIGHT: 0,
  }),
  { virtual: true },
);

jest.mock(
  '@constants/surveyPause',
  () => ({
    isSurveysPaused: () => false,
    SURVEYS_PAUSED_MESSAGE_EN: '',
    SURVEYS_PAUSED_MESSAGE_KO: '',
  }),
  { virtual: true },
);

jest.mock(
  '@design-system',
  () => {
    const React = jest.requireActual<typeof import('react')>('react');
    function MockLayout({ children, ...props }: { children?: ReactNode }) {
      return React.createElement('div', props, children);
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

jest.mock(
  '@utils/apis/survey',
  () => ({
    getSurveyIndex: jest.fn(),
  }),
  { virtual: true },
);

const mockedUseSWR = useSWR as unknown as jest.Mock;

const entry = (
  overrides: Partial<SurveyIndexEntry> &
    Pick<SurveyIndexEntry, 'id' | 'cadence' | 'survey' | 'bucket'>,
): SurveyIndexEntry => ({
  sequence_index: overrides.id,
  sidebar_order: null,
  window_start: '2026-05-18',
  window_end: '2026-05-18',
  allow_late: true,
  user_answered: false,
  submitted_at: null,
  redirect_url: `/surveys/${overrides.survey.slug}`,
  results_unlocked: false,
  draft: null,
  ...overrides,
});

describe('SurveysIndex', () => {
  beforeEach(() => {
    mockedUseSWR.mockReset();
  });

  it('shows survey titles without exposing internal cadence labels', () => {
    const data: SurveyIndexResponse = {
      available_now: [
        entry({
          id: 1,
          cadence: 'biweekly',
          bucket: 'available_now',
          survey: {
            slug: 'mid_study_w',
            title_en: 'Phase 1 reflection: Part 1',
            title_ko: 'Phase 1 reflection: Part 1',
          },
        }),
      ],
      late_but_accepted: [
        entry({
          id: 2,
          cadence: 'endpoint',
          bucket: 'late_but_accepted',
          survey: {
            slug: 'goal_comparison_p1',
            title_en: 'Phase 1 reflection: Part 2',
            title_ko: 'Phase 1 reflection: Part 2',
          },
        }),
      ],
      completed: [],
    };
    mockedUseSWR.mockReturnValue({ data });

    render(
      <MemoryRouter>
        <SurveysIndex />
      </MemoryRouter>,
    );

    expect(screen.getByText('Phase 1 reflection: Part 1')).toBeInTheDocument();
    expect(screen.getByText('Phase 1 reflection: Part 2')).toBeInTheDocument();
    expect(screen.queryByText('biweekly')).not.toBeInTheDocument();
    expect(screen.queryByText('endpoint')).not.toBeInTheDocument();
  });

  it('combines available and late surveys into a single to-do section with row status badges', () => {
    const data: SurveyIndexResponse = {
      available_now: [
        entry({
          id: 0,
          cadence: 'biweekly',
          bucket: 'available_now',
          allow_late: true,
          sidebar_order: 1,
          survey: {
            slug: 'phase1_friend_closeness',
            title_en: 'Rate your closeness with each friend (Phase 1)',
            title_ko: 'Rate your closeness with each friend (Phase 1)',
          },
        }),
        entry({
          id: 5,
          cadence: 'endpoint',
          bucket: 'available_now',
          sidebar_order: 2,
          survey: {
            slug: 'goal_comparison_p1',
            title_en: 'Phase 1 reflection: Part 1',
            title_ko: 'Phase 1 reflection: Part 1',
          },
        }),
        entry({
          id: 1,
          cadence: 'daily',
          bucket: 'available_now',
          allow_late: false,
          survey: {
            slug: 'habit_platform',
            title_en: 'Habitual platform',
            title_ko: 'Habitual platform',
          },
        }),
        entry({
          id: 2,
          cadence: 'daily',
          bucket: 'available_now',
          allow_late: false,
          survey: {
            slug: 'sotd_d15_shi',
            title_en: 'Survey of the Day',
            title_ko: 'Survey of the Day',
          },
        }),
        entry({
          id: 3,
          cadence: 'biweekly',
          bucket: 'available_now',
          allow_late: true,
          sidebar_order: 4,
          survey: {
            slug: 'feature_eval_w',
            title_en: 'Ver. W features',
            title_ko: 'Ver. W features',
          },
          window_end: '2026-05-24',
        }),
        entry({
          id: 4,
          cadence: 'biweekly',
          bucket: 'available_now',
          allow_late: true,
          sidebar_order: 3,
          window_end: '2026-05-19',
          survey: {
            slug: 'mid_study_w',
            title_en: 'Phase 1 reflection: Part 2',
            title_ko: 'Phase 1 reflection: Part 2',
          },
        }),
        entry({
          id: 7,
          cadence: 'anytime',
          bucket: 'available_now',
          window_end: null,
          survey: {
            slug: 'anytime_reflection',
            title_en: 'Drop us a note',
            title_ko: 'Drop us a note',
          },
        }),
      ],
      late_but_accepted: [
        entry({
          id: 6,
          cadence: 'weekly',
          bucket: 'late_but_accepted',
          survey: {
            slug: 'week2_reflection',
            title_en: 'Week 2 reflection',
            title_ko: 'Week 2 reflection',
          },
        }),
      ],
      completed: [],
    };
    mockedUseSWR.mockReturnValue({ data });

    render(
      <MemoryRouter>
        <SurveysIndex />
      </MemoryRouter>,
    );

    expect(screen.getByText('To-do')).toBeInTheDocument();
    expect(screen.getByText('Rate your closeness with each friend (Phase 1)')).toBeInTheDocument();
    expect(screen.getByText('Phase 1 reflection: Part 1')).toBeInTheDocument();
    expect(screen.getByText('Phase 1 reflection: Part 2')).toBeInTheDocument();
    expect(screen.getByText('Ver. W features')).toBeInTheDocument();
    expect(screen.getByText('Habitual platform')).toBeInTheDocument();
    expect(screen.getByText('Survey of the Day')).toBeInTheDocument();
    expect(screen.getByText('Drop us a note')).toBeInTheDocument();
    expect(screen.getByText('Week 2 reflection')).toBeInTheDocument();
    expect(screen.getAllByText(/Was due/)).toHaveLength(1);
    expect(screen.queryByText('bucket_available_now')).not.toBeInTheDocument();
    expect(screen.queryByText('bucket_late_but_accepted')).not.toBeInTheDocument();
    expect(screen.getAllByText('Due today')).toHaveLength(4);
    expect(screen.getByText('Due tomorrow')).toBeInTheDocument();
    expect(screen.getByText('Due Sun')).toBeInTheDocument();
    expect(screen.queryByText('Today only')).not.toBeInTheDocument();
    expect(screen.getAllByText('High priority')).toHaveLength(4);
    expect(screen.getAllByText('Late but accepted')).toHaveLength(1);

    const bodyText = document.body.textContent ?? '';
    const closenessIndex = bodyText.indexOf('Rate your closeness with each friend (Phase 1)');
    const phase1Index = bodyText.indexOf('Phase 1 reflection: Part 1');
    const phase2Index = bodyText.indexOf('Phase 1 reflection: Part 2');
    const featureIndex = bodyText.indexOf('Ver. W features');
    const habitIndex = bodyText.indexOf('Habitual platform');
    const sotdIndex = bodyText.indexOf('Survey of the Day');
    const anytimeIndex = bodyText.indexOf('Drop us a note');
    expect(closenessIndex).toBeGreaterThanOrEqual(0);
    expect(phase1Index).toBeGreaterThanOrEqual(0);
    expect(phase2Index).toBeGreaterThanOrEqual(0);
    expect(featureIndex).toBeGreaterThanOrEqual(0);
    expect(closenessIndex).toBeLessThan(phase1Index);
    expect(phase1Index).toBeLessThan(phase2Index);
    expect(phase2Index).toBeLessThan(featureIndex);
    expect(featureIndex).toBeLessThan(habitIndex);
    expect(phase1Index).toBeLessThan(habitIndex);
    expect(phase2Index).toBeLessThan(habitIndex);
    expect(featureIndex).toBeLessThan(sotdIndex);
    expect(phase1Index).toBeLessThan(sotdIndex);
    expect(phase2Index).toBeLessThan(sotdIndex);
    expect(anytimeIndex).toBeGreaterThan(sotdIndex);

    const noteRow = screen.getByRole('button', { name: 'Drop us a note' });
    expect(noteRow).not.toHaveTextContent('Due today');
  });

  it('lists completed daily surveys individually instead of collapsing them into an archive row', () => {
    const data: SurveyIndexResponse = {
      available_now: [],
      late_but_accepted: [],
      completed: [
        entry({
          id: 1,
          cadence: 'daily',
          bucket: 'completed',
          submitted_at: '2026-05-18T12:00:00Z',
          results_unlocked: false,
          survey: {
            slug: 'sotd_d15_shi',
            title_en: 'Daily habit survey',
            title_ko: 'Daily habit survey',
          },
        }),
        entry({
          id: 2,
          cadence: 'biweekly',
          bucket: 'completed',
          submitted_at: '2026-05-18T12:00:00Z',
          results_unlocked: true,
          survey: {
            slug: 'mid_study_w',
            title_en: 'Phase 1 reflection',
            title_ko: 'Phase 1 reflection',
          },
        }),
      ],
    };
    mockedUseSWR.mockReturnValue({ data });

    render(
      <MemoryRouter>
        <SurveysIndex />
      </MemoryRouter>,
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Daily habit survey')).toBeInTheDocument();
    expect(screen.getByText('Phase 1 reflection')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Check Results' })).toHaveLength(1);
    expect(screen.queryByText('Daily check-ins collapsed')).not.toBeInTheDocument();
  });

  it('shows draft progress for in-progress available surveys', () => {
    const data: SurveyIndexResponse = {
      available_now: [
        entry({
          id: 1,
          cadence: 'daily',
          bucket: 'available_now',
          survey: {
            slug: 'daily_base',
            title_en: 'Daily check-in',
            title_ko: 'Daily check-in',
          },
          draft: {
            progress_pct: 50,
            answered_pages: 1,
            total_pages: 2,
            saved_at: '2026-05-18T10:00:00.000Z',
          },
        }),
      ],
      late_but_accepted: [],
      completed: [],
    };
    mockedUseSWR.mockReturnValue({ data });

    render(
      <MemoryRouter>
        <SurveysIndex />
      </MemoryRouter>,
    );

    expect(screen.getByText('50% done')).toBeInTheDocument();
  });
});
