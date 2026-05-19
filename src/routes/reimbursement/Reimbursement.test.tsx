/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import useSWR from 'swr';

import Reimbursement from './Reimbursement';

jest.mock('swr');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, number | string>) => {
      if (key === 'summary_title') return 'Your study points';
      if (key === 'provisional_total_label') return 'Provisional points';
      if (key === 'dollar_estimate_label') return `~$${options?.amount} estimated`;
      if (key === 'audit_disclaimer_long') return 'Points are provisional after audit.';
      if (key === 'what_earns_title') return 'What earns points';
      if (key === 'what_earns_body') return 'Important surveys and activities earn points.';
      if (key === 'conversion_rate') return `${options?.points} pts = $1`;
      if (key === 'section_surveys') return 'Surveys';
      if (key === 'section_other_activities') return 'Other activities';
      if (key === 'section_pending') return 'Pending';
      if (key === 'downgraded_label') return 'Adjusted after audit';
      if (key === 'pending_prereq_copy') return `Complete ${options?.title} first`;
      return key;
    },
  }),
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
    default: {
      language: 'en',
      t: (key: string) => (key === 'header.reimbursement' ? 'Reimbursement' : key),
    },
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

jest.mock('../Root', () => ({
  MainScrollContainer: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

const mockedUseSWR = useSWR as unknown as jest.Mock;

describe('Reimbursement', () => {
  beforeEach(() => {
    mockedUseSWR.mockReset();
  });

  it('shows totals, grouped awards, adjusted values, and pending prereqs', () => {
    mockedUseSWR.mockReturnValue({
      data: {
        provisional_total: 60,
        adjusted_total: 45,
        available_max: 100,
        dollar_estimate_cents: 563,
        points_per_dollar: 8,
        awards: [
          {
            source_kind: 'survey',
            source_slug: 'mid_study_w',
            scheduled_survey_id: 42,
            title_en: 'Phase 1 reflection',
            title_ko: 'Phase 1 reflection',
            cadence: 'biweekly',
            window_start: '2026-05-18',
            window_end: '2026-05-19',
            awarded_points: 50,
            adjusted_points: 35,
            effective_points: 35,
            note: 'Adjusted after review.',
            submitted_at: '2026-05-18T12:00:00Z',
          },
          {
            source_kind: 'wit_bot_audit',
            source_slug: 'wit_bot_audit',
            scheduled_survey_id: null,
            title_en: 'Wit_bot audit pass',
            title_ko: 'Wit_bot audit pass',
            cadence: null,
            window_start: null,
            window_end: null,
            awarded_points: 10,
            adjusted_points: null,
            effective_points: 10,
            note: '',
            submitted_at: '2026-05-18T12:00:00Z',
          },
        ],
        pending_prereqs: [
          {
            survey_slug: 'sotd_d15_shi',
            scheduled_survey_id: 115,
            title_en: 'How automatic is Instagram?',
            title_ko: 'How automatic is Instagram?',
            potential_points: 10,
            prereq_slug: 'habit_platform',
            prereq_title_en: 'Habitual platform',
            prereq_title_ko: 'Habitual platform',
          },
        ],
      },
    });

    render(<Reimbursement />);

    expect(screen.getByText('45 / 100 pts')).toBeInTheDocument();
    expect(screen.getByText('~$5.63 estimated')).toBeInTheDocument();
    expect(screen.getByText('Phase 1 reflection')).toBeInTheDocument();
    expect(screen.getByText('35 pts')).toBeInTheDocument();
    expect(screen.getByText('50 pts')).toBeInTheDocument();
    expect(screen.getByText('Adjusted after audit')).toBeInTheDocument();
    expect(screen.getByText('Wit_bot audit pass')).toBeInTheDocument();
    expect(screen.getByText('+10 pts available')).toBeInTheDocument();
    expect(screen.getByText('Complete Habitual platform first')).toBeInTheDocument();
  });
});
