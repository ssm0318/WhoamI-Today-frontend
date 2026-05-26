/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import useSWR from 'swr';

import Reimbursement from './Reimbursement';

jest.mock('swr');

const mockShouldUseLocalAllocationPreview = jest.fn();

jest.mock(
  '@stores/useBoundStore',
  () => ({
    useBoundStore: (selector: (state: { myProfile: { id: number } }) => unknown) =>
      selector({ myProfile: { id: 8 } }),
  }),
  { virtual: true },
);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, number | string>) => {
      if (key === 'summary_title') return 'Your study points';
      if (key === 'provisional_total_label') return 'Provisional points';
      if (key === 'dollar_estimate_label') return `~$${options?.amount} estimated reimbursement`;
      if (key === 'audit_disclaimer_long') return 'Points are provisional after audit.';
      if (key === 'what_earns_title') return 'What earns points';
      if (key === 'what_earns_body') return 'Important surveys and activities earn points.';
      if (key === 'conversion_rate') return `${options?.points} pts = $1`;
      if (key === 'section_surveys') return 'Surveys';
      if (key === 'section_other_activities') return 'Other activities';
      if (key === 'section_pending') return 'Pending';
      if (key === 'downgraded_label') return 'Adjusted after audit';
      if (key === 'pending_prereq_copy') return `Complete ${options?.title} first`;
      if (key === 'tbu_eyebrow') return 'To be updated';
      if (key === 'tbu_title') return 'Reimbursement details are being finalized';
      if (key === 'tbu_body') {
        return 'Point allocation has not been finalized yet. Please keep completing study activities.';
      }
      if (key === 'local_preview_notice_title') return 'Reimbursement preview';
      if (key === 'local_preview_notice_body') {
        return 'We are still balancing reimbursement amounts. This preview uses the current draft allocation.';
      }
      if (key === 'study_max_note_body') {
        return 'The study was described as up to $60 for participation, including interview participation, plus up to $50 for friend invitations. The current draft allocates up to $90 for participation, which is intentional while reimbursement is being finalized.';
      }
      if (key === 'deadline_passed') return 'Deadline passed';
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
    getLocalAllocationPreview: jest.fn(),
    shouldUseLocalAllocationPreview: () => mockShouldUseLocalAllocationPreview(),
    LOCAL_ALLOCATION_PREVIEW_KEY: 'local-reimbursement-allocation-preview',
    REIMBURSEMENT_KEY: '/surveys/reimbursement/',
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

jest.mock('../Root', () => ({
  MainScrollContainer: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

const mockedUseSWR = useSWR as unknown as jest.Mock;

describe('Reimbursement', () => {
  beforeEach(() => {
    mockedUseSWR.mockReset();
    mockShouldUseLocalAllocationPreview.mockReturnValue(false);
  });

  it('prefers the rich local allocation preview on localhost', () => {
    mockShouldUseLocalAllocationPreview.mockReturnValue(true);
    mockedUseSWR.mockImplementation((key: string | readonly [string, number | null] | null) => {
      if (Array.isArray(key)) {
        return {
          data: {
            db: { name: 'whoamitoday_merged', participantCount: 80 },
            selectedUser: { id: 8, username: 'participant_8', responseTotal: 12 },
            pointsPerDollar: 10,
            availableMax: 110,
            earnedPoints: 50,
            estimatedDollars: '5.00',
            sourceCount: 3,
            rows: [
              {
                key: 'survey:open_survey',
                kind: 'survey',
                slug: 'open_survey',
                title: 'Open survey',
                category: 'Survey',
                points: 0,
                rawPoints: 0,
                possiblePoints: 10,
                currentPossiblePoints: 10,
                completedCount: 0,
                appUrl: '/surveys/open_survey/answer',
                canEarn: true,
                availability: 'available',
                capGroup: '',
                capPoints: null,
                gateSlug: '',
                latePercent: 100,
                priorityRating: 0,
                status: 'pending',
                note: '',
              },
              {
                key: 'survey:feature_eval_w',
                kind: 'survey',
                slug: 'feature_eval_w',
                title: 'Ver. W features',
                category: 'Recovery',
                points: 0,
                rawPoints: 0,
                possiblePoints: 20,
                currentPossiblePoints: 10,
                completedCount: 0,
                appUrl: '/surveys/feature_eval_w/answer',
                canEarn: true,
                availability: 'late',
                capGroup: '',
                capPoints: null,
                gateSlug: '',
                latePercent: 50,
                priorityRating: 1,
                status: 'pending',
                note: 'Late submissions are still accepted. Current draft credit is 10 pts.',
              },
              {
                key: 'manual:wit_bot_audit_phase_1',
                kind: 'manual',
                slug: 'wit_bot_audit_phase_1',
                title: 'Wit_bot audit pass - Phase 1',
                category: 'Manual activities',
                points: 40,
                rawPoints: 40,
                possiblePoints: 40,
                currentPossiblePoints: 40,
                completedCount: 1,
                appUrl: '/users/7/chat',
                canEarn: false,
                availability: 'available',
                capGroup: '',
                capPoints: null,
                gateSlug: '',
                latePercent: 100,
                priorityRating: 2,
                status: 'earned',
                note: '',
              },
            ],
            capRules: [],
            gateRules: [],
            lateRules: [],
          },
        };
      }
      if (key === '/surveys/reimbursement/') {
        return {
          data: {
            provisional_total: 1,
            adjusted_total: 1,
            available_max: 1,
            dollar_estimate_cents: 13,
            points_per_dollar: 8,
            awards: [],
            pending_prereqs: [],
          },
        };
      }
      return { data: null };
    });

    render(<Reimbursement />);

    expect(screen.getByText('Reimbursement preview')).toBeInTheDocument();
    expect(screen.getByText('50 pts')).toBeInTheDocument();
    expect(screen.getByText('Earn more points')).toBeInTheDocument();
    expect(screen.getByText('Late credit')).toBeInTheDocument();
    expect(screen.getByText('Prerequisite/Must Complete')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Take survey' })[0]).toHaveAttribute(
      'href',
      '/surveys/open_survey/answer',
    );
    expect(screen.queryByText('1 / 1 pts')).not.toBeInTheDocument();
    expect(screen.queryByText('Recovery')).not.toBeInTheDocument();
  });

  it('renders public reimbursement totals when allocation is open', () => {
    mockedUseSWR.mockImplementation((key: string | readonly [string, number | null] | null) => {
      if (key === '/surveys/reimbursement/') {
        return {
          data: {
            provisional_total: 48,
            adjusted_total: 45,
            available_max: 100,
            dollar_estimate_cents: 450,
            points_per_dollar: 10,
            awards: [
              {
                source_kind: 'survey',
                source_slug: 'phase_1_reflection',
                scheduled_survey_id: 12,
                title_en: 'Phase 1 reflection',
                title_ko: 'Phase 1 reflection',
                cadence: 'endpoint',
                window_start: '2026-05-17',
                window_end: '2026-05-18',
                awarded_points: 30,
                adjusted_points: null,
                effective_points: 30,
                note: '',
                submitted_at: '2026-05-18T12:00:00Z',
              },
              {
                source_kind: 'app_usage',
                source_slug: 'app_usage_phase_1',
                scheduled_survey_id: null,
                title_en: 'App usage - Phase 1',
                title_ko: 'App usage - Phase 1',
                cadence: null,
                window_start: null,
                window_end: null,
                awarded_points: 18,
                adjusted_points: 15,
                effective_points: 15,
                note: 'Adjusted after review.',
                submitted_at: '2026-05-18T12:00:00Z',
              },
            ],
            pending_prereqs: [
              {
                survey_slug: 'feature_eval_w',
                scheduled_survey_id: 44,
                title_en: 'How automatic is {{habit_platform_label}} for you?',
                title_ko: 'How automatic is {{habit_platform_label}} for you?',
                potential_points: 20,
                prereq_slug: 'habit_platform',
                prereq_title_en: 'Habitual platform',
                prereq_title_ko: 'Habitual platform',
              },
            ],
          },
        };
      }
      if (key === '/surveys/index/') {
        return {
          data: {
            available_now: [
              {
                id: 101,
                cadence: 'endpoint',
                sequence_index: 1,
                sidebar_order: 1,
                window_start: '2026-05-25',
                window_end: '2026-05-30',
                allow_late: true,
                survey: {
                  slug: 'open_survey',
                  title_en: 'Open survey',
                  title_ko: 'Open survey',
                  priority: 20,
                  editable: false,
                  closed: false,
                },
                bucket: 'available_now',
                user_answered: false,
                submitted_at: null,
                redirect_url: '/surveys/open_survey/answer',
                results_unlocked: false,
                draft: null,
                point_value: 10,
                point_locked_by_prereq_slug: null,
                point_locked_by_prereq_title_en: null,
                point_locked_by_prereq_title_ko: null,
                point_award: null,
              },
              {
                id: 102,
                cadence: 'daily',
                sequence_index: 2,
                sidebar_order: 2,
                window_start: '2026-05-25',
                window_end: '2026-05-25',
                allow_late: true,
                survey: {
                  slug: 'sotd_locked',
                  title_en: 'How automatic is {{habit_platform_label}} for you?',
                  title_ko: 'How automatic is {{habit_platform_label}} for you?',
                  priority: 20,
                  editable: false,
                  closed: false,
                },
                bucket: 'available_now',
                user_answered: false,
                submitted_at: null,
                redirect_url: '/surveys/sotd_locked/answer',
                results_unlocked: false,
                draft: null,
                point_value: 10,
                point_locked_by_prereq_slug: 'habit_platform',
                point_locked_by_prereq_title_en: 'Habitual platform',
                point_locked_by_prereq_title_ko: 'Habitual platform',
                point_award: null,
              },
            ],
            late_but_accepted: [],
            completed: [],
          },
        };
      }
      return { data: null };
    });

    render(<Reimbursement />);

    expect(screen.queryByText('To be updated')).not.toBeInTheDocument();
    expect(screen.queryByText('Reimbursement details are being finalized')).not.toBeInTheDocument();
    expect(screen.queryByText('What earns points')).not.toBeInTheDocument();
    expect(screen.getByText('45 pts')).toBeInTheDocument();
    expect(screen.getByText('~$4.50 estimated reimbursement')).toBeInTheDocument();
    expect(
      screen.getByText('10 pts = $1. Final reimbursement may change after study review.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Earn more points')).toBeInTheDocument();
    expect(screen.getByText('Open survey')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Take survey' })).toHaveAttribute(
      'href',
      '/surveys/open_survey/answer',
    );
    expect(screen.getByText('Available later')).toBeInTheDocument();
    expect(screen.getByText('Interview signup')).toBeInTheDocument();
    expect(screen.getByText('Points you earned')).toBeInTheDocument();
    expect(screen.getByText('Phase 1 reflection')).toBeInTheDocument();
    expect(screen.getByText('App usage - Phase 1')).toBeInTheDocument();
    expect(screen.getByText('Adjusted after review.')).toBeInTheDocument();
    expect(screen.getByText('15 pts')).toBeInTheDocument();
    expect(screen.getByText('18 pts')).toBeInTheDocument();
    expect(
      screen.queryByText('How automatic is {{habit_platform_label}} for you?'),
    ).not.toBeInTheDocument();
  });

  it('shows a production loading state instead of a blank page while totals load', () => {
    mockedUseSWR.mockReturnValue({ data: null });

    render(<Reimbursement />);

    expect(screen.getByText('Reimbursement preview')).toBeInTheDocument();
    expect(screen.getByText('Loading reimbursement details...')).toBeInTheDocument();
  });
});
