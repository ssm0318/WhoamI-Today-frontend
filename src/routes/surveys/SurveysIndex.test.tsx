/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import useSWR from 'swr';

import type { SurveyIndexEntry, SurveyIndexResponse } from '@models/survey';

import SurveysIndex from './SurveysIndex';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { date?: string }) => {
      if (key.startsWith('cadence.')) return key.replace('cadence.', '');
      if (key === 'was_due') return `Was due ${options?.date}`;
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
    DeadlineBadge: () => null,
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
});
