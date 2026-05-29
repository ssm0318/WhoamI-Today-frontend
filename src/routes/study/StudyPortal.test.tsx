/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import useSWR from 'swr';

import type { ReimbursementState } from '@models/reimbursement';
import type { SurveyIndexEntry, SurveyIndexResponse } from '@models/survey';

import StudyPortal from './StudyPortal';

jest.mock('swr');

jest.mock(
  '@i18n/index',
  () => ({
    __esModule: true,
    default: {
      language: 'en',
    },
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

jest.mock(
  '@utils/apis/reimbursement',
  () => ({
    getReimbursementState: jest.fn(),
    REIMBURSEMENT_KEY: '/surveys/reimbursement/',
  }),
  { virtual: true },
);

jest.mock(
  '@components/survey/PointsBadge',
  () => ({
    __esModule: true,
    default: ({
      pointValue,
      pointAward,
    }: {
      pointValue: number;
      pointAward?: { effective_points: number } | null;
    }) => <span>+{pointAward?.effective_points ?? pointValue} pts</span>,
  }),
  { virtual: true },
);

jest.mock(
  '@design-system',
  () => ({
    Colors: {
      BLACK: '#000',
      DARK_GRAY: '#555',
      LIGHT_GRAY: '#ddd',
      WHITE: '#fff',
    },
  }),
  { virtual: true },
);

const mockedUseSWR = useSWR as unknown as jest.Mock;

const entry = (
  id: number,
  title: string,
  bucket: SurveyIndexEntry['bucket'],
  redirectUrl: string,
  pointValue: number,
): SurveyIndexEntry => ({
  id,
  cadence: 'weekly',
  sequence_index: id,
  sidebar_order: null,
  window_start: '2026-05-28',
  window_end: '2026-06-01',
  allow_late: bucket === 'late_but_accepted',
  survey: {
    slug: `survey_${id}`,
    title_en: title,
    title_ko: title,
    priority: 1,
    editable: false,
    closed: false,
  },
  bucket,
  user_answered: bucket === 'completed',
  submitted_at: bucket === 'completed' ? '2026-05-28T12:00:00Z' : null,
  redirect_url: redirectUrl,
  results_unlocked: false,
  draft: null,
  point_value: pointValue,
  point_locked_by_prereq_slug: null,
  point_locked_by_prereq_title_en: null,
  point_locked_by_prereq_title_ko: null,
  point_award:
    bucket === 'completed'
      ? {
          awarded_points: pointValue,
          adjusted_points: null,
          effective_points: pointValue,
          note: '',
        }
      : null,
});

const indexData: SurveyIndexResponse = {
  available_now: [entry(1, 'Feature evaluation', 'available_now', '/surveys/feature/answer', 40)],
  late_but_accepted: [
    entry(2, 'Daily reflection', 'late_but_accepted', '/surveys/daily/answer', 5),
  ],
  completed: [entry(3, 'Intro survey', 'completed', '/surveys/intro/results', 10)],
};

const reimbursementData: ReimbursementState = {
  provisional_total: 60,
  adjusted_total: 60,
  available_max: 320,
  dollar_estimate_cents: 600,
  points_per_dollar: 10,
  awards: [
    {
      source_kind: 'survey',
      source_slug: 'intro',
      scheduled_survey_id: 3,
      title_en: 'Intro survey',
      title_ko: 'Intro survey',
      cadence: 'weekly',
      window_start: '2026-05-18',
      window_end: '2026-05-19',
      awarded_points: 10,
      adjusted_points: null,
      effective_points: 10,
      note: '',
      submitted_at: '2026-05-28T12:00:00Z',
    },
  ],
  pending_prereqs: [
    {
      survey_slug: 'locked_survey',
      scheduled_survey_id: 4,
      title_en: 'Locked survey',
      title_ko: 'Locked survey',
      potential_points: 20,
      prereq_slug: 'feature',
      prereq_title_en: 'Feature evaluation',
      prereq_title_ko: 'Feature evaluation',
    },
  ],
};

describe('StudyPortal', () => {
  beforeEach(() => {
    mockedUseSWR.mockReset();
    mockedUseSWR.mockImplementation((key: string) => {
      if (key === '/surveys/index/') return { data: indexData };
      if (key === '/surveys/reimbursement/') return { data: reimbursementData };
      return { data: undefined };
    });
  });

  it('shows desktop survey actions and reimbursement status', () => {
    render(
      <MemoryRouter initialEntries={['/study']}>
        <StudyPortal />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Study dashboard' })).toBeInTheDocument();
    expect(screen.getByText('60 / 320 pts')).toBeInTheDocument();
    expect(screen.getByText('~$6.00 estimated')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'To do now' })).toBeInTheDocument();
    expect(screen.getByText('Feature evaluation')).toBeInTheDocument();
    expect(screen.getByText('Daily reflection')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Completed' })).toBeInTheDocument();
    expect(screen.getAllByText('Intro survey').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('heading', { name: 'Blocked until another survey is done' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Complete Feature evaluation first')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Start' })[0]).toHaveAttribute(
      'href',
      '/surveys/feature/answer',
    );
  });
});
