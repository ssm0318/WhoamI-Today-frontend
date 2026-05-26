/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import useSWR from 'swr';

import Reimbursement from './Reimbursement';

jest.mock('swr');

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

  it('shows a TBU notice instead of public point totals while allocation is unfinished', () => {
    mockedUseSWR.mockReturnValue({ data: null });

    render(<Reimbursement />);

    expect(screen.getByText('To be updated')).toBeInTheDocument();
    expect(screen.getByText('Reimbursement details are being finalized')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Point allocation has not been finalized yet. Please keep completing study activities.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('45 / 100 pts')).not.toBeInTheDocument();
    expect(screen.queryByText('~$5.63 estimated')).not.toBeInTheDocument();
    expect(screen.queryByText('Phase 1 reflection')).not.toBeInTheDocument();
  });

  it('renders a local allocation preview while public reimbursement is still TBU', () => {
    mockedUseSWR.mockImplementation((key: string | readonly [string, number | null] | null) => {
      if (Array.isArray(key) && key[0] === 'local-reimbursement-allocation-preview') {
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
                key: 'survey:daily_base',
                kind: 'survey',
                slug: 'daily_base',
                title: 'Today on WIT',
                category: 'Daily diary',
                points: 30,
                rawPoints: 36,
                possiblePoints: 3,
                completedCount: 12,
                appUrl: '/surveys/daily_base/answer',
                canEarn: false,
                availability: 'deadline',
                capGroup: 'daily_diary',
                capPoints: 30,
                gateSlug: '',
                latePercent: 100,
                priorityRating: 0,
                status: 'earned',
                note: 'Capped by daily_diary at 30 pts.',
              },
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
                key: 'survey:expired_survey',
                kind: 'survey',
                slug: 'expired_survey',
                title: 'Expired survey',
                category: 'Survey',
                points: 0,
                rawPoints: 0,
                possiblePoints: 12,
                currentPossiblePoints: 12,
                completedCount: 0,
                appUrl: '/surveys/expired_survey/answer',
                canEarn: false,
                availability: 'deadline',
                capGroup: '',
                capPoints: null,
                gateSlug: '',
                latePercent: 100,
                priorityRating: 0,
                status: 'pending',
                note: 'The deadline for this activity has passed.',
              },
              {
                key: 'survey:feature_eval_w',
                kind: 'survey',
                slug: 'feature_eval_w',
                title: 'Ver. W features',
                category: 'Survey',
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
                points: 20,
                rawPoints: 20,
                possiblePoints: 20,
                currentPossiblePoints: 20,
                completedCount: 1,
                appUrl: '/chats',
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
              {
                key: 'manual:wit_bot_audit_phase_2',
                kind: 'manual',
                slug: 'wit_bot_audit_phase_2',
                title: 'Wit_bot audit pass - Phase 2',
                category: 'Manual activities',
                points: 0,
                rawPoints: 0,
                possiblePoints: 20,
                currentPossiblePoints: 20,
                completedCount: 0,
                appUrl: '/users/7/chat',
                canEarn: true,
                availability: 'available',
                capGroup: '',
                capPoints: null,
                gateSlug: '',
                latePercent: 100,
                status: 'pending',
                note: '',
              },
              {
                key: 'manual:interview_signup',
                kind: 'manual',
                slug: 'interview_signup',
                title: 'Interview signup',
                category: 'Manual activities',
                points: 0,
                rawPoints: 0,
                possiblePoints: 150,
                currentPossiblePoints: 150,
                completedCount: 0,
                appUrl: '/chats',
                canEarn: false,
                availability: 'future',
                capGroup: '',
                capPoints: null,
                gateSlug: '',
                latePercent: 100,
                priorityRating: 0,
                status: 'pending',
                note: 'This activity is not available yet.',
              },
              {
                key: 'manual:friend_invite',
                kind: 'manual',
                slug: 'friend_invite',
                title: 'Friend invite reimbursement',
                category: 'Manual activities',
                points: 0,
                rawPoints: 0,
                possiblePoints: 500,
                currentPossiblePoints: 500,
                completedCount: 0,
                appUrl: '/friends/explore',
                canEarn: false,
                availability: 'deadline',
                capGroup: '',
                capPoints: null,
                gateSlug: '',
                latePercent: 100,
                priorityRating: 0,
                status: 'pending',
                note: 'The deadline for this activity has passed.',
              },
            ],
            capRules: [
              {
                group: 'daily_diary',
                capPoints: 30,
                sourceCount: 1,
                availablePoints: 30,
                earnedPoints: 30,
              },
            ],
            gateRules: [],
            lateRules: [],
          },
        };
      }
      return { data: null };
    });

    render(<Reimbursement />);

    expect(screen.getByText('Reimbursement preview')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The study was described as up to $60 for participation, including interview participation, plus up to $50 for friend invitations. The current draft allocates up to $90 for participation, which is intentional while reimbursement is being finalized.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('50 pts')).toBeInTheDocument();
    expect(screen.getByText('~$5.00 estimated reimbursement')).toBeInTheDocument();
    expect(screen.getByText(/10 pts = \$1/)).toBeInTheDocument();
    expect(screen.getByText('Earn more points')).toBeInTheDocument();
    expect(screen.getByText('Available later')).toBeInTheDocument();
    expect(screen.getByText('Points you earned')).toBeInTheDocument();
    expect(screen.getByText('Need help with missed points?')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Take survey' })[0]).toHaveAttribute(
      'href',
      '/surveys/open_survey/answer',
    );
    expect(screen.getAllByRole('link', { name: 'Take survey' })[1]).toHaveAttribute(
      'href',
      '/surveys/feature_eval_w/answer',
    );
    expect(screen.getByRole('link', { name: 'Open WIT chat' })).toHaveAttribute(
      'href',
      '/users/7/chat',
    );
    expect(screen.getByRole('link', { name: 'Ask admin' })).toHaveAttribute('href', '/chats');
    expect(screen.getByText('Today on WIT')).toBeInTheDocument();
    expect(screen.getByText('Open survey')).toBeInTheDocument();
    expect(screen.getByText('Ver. W features')).toBeInTheDocument();
    expect(screen.getByText('Expired survey')).toBeInTheDocument();
    expect(screen.getByText('Interview signup')).toBeInTheDocument();
    expect(screen.getByText('Friend invite reimbursement')).toBeInTheDocument();
    expect(screen.getByText('Will be updated')).toBeInTheDocument();
    expect(
      screen.getByText('Friend invite reimbursement details will be updated.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Wit_bot audit pass - Phase 1')).toBeInTheDocument();
    expect(
      screen.getByText('This activity is not open yet. Check back later.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Late credit')).toBeInTheDocument();
    expect(
      screen.getByText('Late submissions are still accepted. Current draft credit is 10 pts.'),
    ).toBeInTheDocument();
    expect(screen.getByText('+3 pts')).toBeInTheDocument();
    expect(screen.getByText('High Priority')).toBeInTheDocument();
    expect(screen.getAllByText(/Deadline passed/)).toHaveLength(3);
    expect(screen.getAllByRole('link', { name: 'Ask admin' })).toHaveLength(1);
    expect(screen.queryByText('Completed 12 times')).not.toBeInTheDocument();
    expect(screen.queryByText('Completed')).not.toBeInTheDocument();
    expect(screen.queryByText('Allocation rules')).not.toBeInTheDocument();
    expect(screen.queryByText('Earning rules')).not.toBeInTheDocument();
    expect(screen.queryByText('Caps / gates / late')).not.toBeInTheDocument();
    expect(screen.queryByText(/daily_diary cap/)).not.toBeInTheDocument();
  });
});
