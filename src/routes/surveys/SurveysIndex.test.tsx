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
    DeadlineBadge: ({ windowEnd, allowLate }: { windowEnd: string | null; allowLate: boolean }) => (
      <>
        {windowEnd && <span>Due today</span>}
        {windowEnd && !allowLate && <span>Today only</span>}
      </>
    ),
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
  window_start: '2026-05-18',
  window_end: '2026-05-18',
  allow_late: true,
  user_answered: false,
  submitted_at: null,
  redirect_url: `/surveys/${overrides.survey.slug}`,
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
          id: 1,
          cadence: 'biweekly',
          bucket: 'available_now',
          allow_late: true,
          survey: {
            slug: 'mid_study_w',
            title_en: 'Phase 1 reflection: Part 1',
            title_ko: 'Phase 1 reflection: Part 1',
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
      ],
      late_but_accepted: [
        entry({
          id: 3,
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
    expect(screen.getByText('Phase 1 reflection: Part 1')).toBeInTheDocument();
    expect(screen.getByText('Survey of the Day')).toBeInTheDocument();
    expect(screen.getByText('Week 2 reflection')).toBeInTheDocument();
    expect(screen.getByText(/Was due/)).toBeInTheDocument();
    expect(screen.queryByText('bucket_available_now')).not.toBeInTheDocument();
    expect(screen.queryByText('bucket_late_but_accepted')).not.toBeInTheDocument();
    expect(screen.getAllByText('Due today')).toHaveLength(2);
    expect(screen.getByText('Today only')).toBeInTheDocument();
    expect(screen.getByText('Late but accepted')).toBeInTheDocument();
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
