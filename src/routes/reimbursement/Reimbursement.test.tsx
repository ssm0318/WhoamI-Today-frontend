/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import useSWR from 'swr';

import en from '../../i18n/locales/en/translation.json';
import ko from '../../i18n/locales/ko/translation.json';

import Reimbursement from './Reimbursement';

jest.mock('swr');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, number | string>) => {
      const copy: Record<string, string> = {
        final_eyebrow: 'Final reimbursement',
        final_points_label: 'Your final study points',
        dollar_total_label: `$${options?.amount} reimbursement`,
        conversion_rate: `${options?.points} pts = $1`,
        policy_notice:
          'Surveys determined not to have been answered in good faith were not credited, even when the survey was completed.',
        credited_title: 'Points you earned',
        not_credited_title: 'Not credited',
        adjusted_label: 'Reviewed',
        interview_title: 'Study interview',
        interview_body: `Complete the interview to earn ${options?.points} pts.`,
        interview_action: 'Sign up for interview',
        empty_credited: 'No credited items are recorded.',
        loading: 'Loading reimbursement details…',
      };
      return copy[key] ?? key;
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
  () => ({
    Colors: {
      BLACK: '#000',
      DARK_GRAY: '#555',
      LIGHT_GRAY: '#ddd',
      PRIMARY: '#8700ff',
      WHITE: '#fff',
    },
  }),
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

const finalState = {
  is_final: true,
  provisional_total: 350,
  adjusted_total: 350,
  available_max: 800,
  dollar_estimate_cents: 3500,
  points_per_dollar: 10,
  policy_notice_en:
    'Surveys determined not to have been answered in good faith were not credited, even when the survey was completed.',
  awards: [
    {
      source_kind: 'wit_bot_audit',
      source_slug: 'wit_bot_audit_phase_1',
      scheduled_survey_id: null,
      title_en: 'WIT bot and boss quiz - Phase 1 (Ver.Q)',
      title_ko: 'WIT 봇 및 보스 퀴즈 - 1단계 (Ver.Q)',
      cadence: null,
      window_start: null,
      window_end: null,
      awarded_points: 50,
      adjusted_points: null,
      effective_points: 50,
      note: 'Boss quiz best score=0.900000; audit engaged=9; audit missing=1.',
      submitted_at: '2026-08-19T12:00:00Z',
    },
    {
      source_kind: 'friend_invite',
      source_slug: 'friend_invite',
      scheduled_survey_id: null,
      title_en: 'Friend invitations',
      title_ko: '친구 초대',
      cadence: null,
      window_start: null,
      window_end: null,
      awarded_points: 300,
      adjusted_points: null,
      effective_points: 300,
      note: 'Eligible invites=3; credited invites=3.',
      submitted_at: '2026-08-19T12:00:00Z',
    },
    {
      source_kind: 'survey',
      source_slug: 'post_study_q',
      scheduled_survey_id: 44,
      title_en: 'Post-study survey',
      title_ko: '연구 종료 설문',
      cadence: 'endpoint',
      window_start: '2026-05-30',
      window_end: '2026-06-01',
      awarded_points: 50,
      adjusted_points: 0,
      effective_points: 0,
      note: 'Good-faith survey audit exclusion.',
      submitted_at: '2026-06-01T12:00:00Z',
    },
  ],
  pending_prereqs: [],
  interview_opportunity: {
    completed: false,
    potential_points: 100,
    signup_url: 'https://calendly.com/jaewonkim/60min',
  },
};

describe('Reimbursement', () => {
  beforeEach(() => mockedUseSWR.mockReset());

  it('renders a final frozen ledger and only the interview action', () => {
    mockedUseSWR.mockReturnValue({ data: finalState });

    render(<Reimbursement />);

    expect(screen.getByText('Final reimbursement')).toBeInTheDocument();
    expect(screen.getByTestId('final-summary')).toHaveStyle({ flexShrink: '0' });
    expect(screen.getByText('350 pts')).toBeInTheDocument();
    expect(screen.getByText('$35.00 reimbursement')).toBeInTheDocument();
    expect(screen.getByText('WIT bot and boss quiz - Phase 1 (Ver.Q)')).toBeInTheDocument();
    expect(screen.getByText('Friend invitations')).toBeInTheDocument();
    expect(screen.getByText('Not credited')).toBeInTheDocument();
    expect(screen.getByText('Post-study survey')).toBeInTheDocument();
    expect(screen.getByText('Good-faith survey audit exclusion.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Surveys determined not to have been answered in good faith were not credited, even when the survey was completed.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign up for interview' })).toHaveAttribute(
      'href',
      'https://calendly.com/jaewonkim/60min',
    );
    expect(screen.queryByText(/preview/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/provisional/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /take survey/i })).not.toBeInTheDocument();
    expect(mockedUseSWR).toHaveBeenCalledTimes(1);
    expect(mockedUseSWR).toHaveBeenCalledWith('/surveys/reimbursement/', expect.any(Function));
  });

  it('does not show interview signup after interview credit is recorded', () => {
    mockedUseSWR.mockReturnValue({
      data: {
        ...finalState,
        interview_opportunity: { completed: true, potential_points: 100, signup_url: null },
      },
    });

    render(<Reimbursement />);

    expect(screen.queryByRole('link', { name: 'Sign up for interview' })).not.toBeInTheDocument();
  });

  it('uses final language in both translation files with matching keys', () => {
    const enKeys = Object.keys(en.reimbursement).sort();
    const koKeys = Object.keys(ko.reimbursement).sort();

    expect(koKeys).toEqual(enKeys);
    expect(en.reimbursement.final_eyebrow).toBe('Final reimbursement');
    expect(en.reimbursement.policy_notice).toBe(
      'Surveys determined not to have been answered in good faith were not credited, even when the survey was completed.',
    );
    expect(Object.values(en.reimbursement).join(' ')).not.toMatch(/preview|provisional/i);
  });

  it('uses final language in the loading state', () => {
    mockedUseSWR.mockReturnValue({ data: undefined });

    render(<Reimbursement />);

    expect(screen.getByText('Loading reimbursement details…')).toBeInTheDocument();
    expect(screen.queryByText(/preview/i)).not.toBeInTheDocument();
  });
});
