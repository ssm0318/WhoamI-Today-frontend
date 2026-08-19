/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import type { CSSProperties, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import useSWR from 'swr';

import SideMenu from './SideMenu';

const mockNavigate = jest.fn();
const mockCloseSideMenu = jest.fn();
const mockTrackEvent = jest.fn();
const mockPostAppMessage = jest.fn();
const mockShouldUseLocalAllocationPreview = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => [
    (key: string, options?: { count?: number }) => {
      if (key === 'current_version') return 'Current version';
      if (key === 'request_version_switch') return 'Request version switch';
      if (key === 'request_pending') return 'Request pending';
      if (key === 'my_profile') return 'My profile';
      if (key === 'surveys') return 'Surveys';
      if (key === 'reimbursement') return 'Reimbursement';
      if (key === 'settings') return 'Settings';
      if (key === 'onboarding_video') return 'Onboarding video';
      if (key === 'sidebar_count_one') return `${options?.count ?? 1}`;
      if (key === 'sidebar_count_other') return `${options?.count ?? 0} due`;
      return key;
    },
  ],
}));

jest.mock('swr');

jest.mock(
  '@hooks/useTrackEvent',
  () => ({
    useTrackEvent: () => mockTrackEvent,
  }),
  { virtual: true },
);

jest.mock(
  '@hooks/useAppMessage',
  () => ({
    usePostAppMessage: () => mockPostAppMessage,
  }),
  { virtual: true },
);

jest.mock(
  '@utils/apis/onboardingEvents',
  () => ({
    logOnboardingEvent: jest.fn(),
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
    getLocalAllocationPreview: jest.fn(),
    shouldUseLocalAllocationPreview: () => mockShouldUseLocalAllocationPreview(),
    LOCAL_ALLOCATION_PREVIEW_KEY: 'local-reimbursement-allocation-preview',
    REIMBURSEMENT_KEY: '/surveys/reimbursement/',
  }),
  { virtual: true },
);

jest.mock(
  '@utils/apis/user',
  () => ({
    getMyPendingVersionSwitchRequest: jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  '@utils/navSource',
  () => ({
    classifyPathnameAsSource: (pathname: string) =>
      pathname.startsWith('/friends') ? 'friends' : 'other',
  }),
  { virtual: true },
);

jest.mock(
  '@stores/useBoundStore',
  () => ({
    useBoundStore: (selector: (state: unknown) => unknown) =>
      selector({
        featureFlags: {},
        myProfile: { id: 8, current_ver: 'version_w' },
      }),
  }),
  { virtual: true },
);

jest.mock(
  '@components/_common/emoji-item/EmojiItem',
  () => {
    return function MockEmojiItem({ emojiString }: { emojiString: string }) {
      return <span>{emojiString}</span>;
    };
  },
  { virtual: true },
);

jest.mock(
  '@components/survey/DeadlineBadge.styled',
  () => ({
    Chip: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
  }),
  { virtual: true },
);

jest.mock(
  '@constants/layout',
  () => ({
    Z_INDEX: { MODAL_CONTAINER: 1 },
  }),
  { virtual: true },
);

jest.mock(
  '@constants/url',
  () => ({
    ONBOARDING_VIDEO_URL: 'https://example.com/onboarding',
  }),
  { virtual: true },
);

jest.mock(
  '@models/api/user',
  () => ({
    VersionType: {
      VER_W: 'version_w',
      VER_Q: 'version_q',
    },
  }),
  { virtual: true },
);

jest.mock(
  '@design-system',
  () => {
    const React = jest.requireActual<typeof import('react')>('react');
    function MockLayout({
      children,
      className,
      onClick,
      style,
    }: {
      children?: ReactNode;
      className?: string;
      onClick?: () => void;
      style?: CSSProperties;
    }) {
      return React.createElement('div', { className, onClick, style }, children);
    }
    function MockTypo({ children }: { children?: ReactNode }) {
      return React.createElement('span', null, children);
    }

    return {
      Button: {
        Secondary: ({ text, onClick }: { text: string; onClick: () => void }) => (
          <button type="button" onClick={onClick}>
            {text}
          </button>
        ),
      },
      Layout: {
        Absolute: MockLayout,
        FlexCol: MockLayout,
        FlexRow: MockLayout,
      },
      SvgIcon: ({ onClick }: { onClick?: () => void }) => (
        <button type="button" aria-label="close" onClick={onClick} />
      ),
      Typo: MockTypo,
    };
  },
  { virtual: true },
);

const mockedUseSWR = useSWR as unknown as jest.Mock;
describe('SideMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockShouldUseLocalAllocationPreview.mockReturnValue(false);
    mockedUseSWR.mockImplementation((key: string | readonly [string, number | null] | null) => {
      if (key === '/surveys/index/') return { data: { available_now: [] } };
      if (key === '/surveys/reimbursement/') return { data: null };
      if (Array.isArray(key) && key[0] === 'local-reimbursement-allocation-preview') {
        return { data: null };
      }
      if (key === '/user/version-switch-request/me/') return { data: { pending: false } };
      return { data: null };
    });
  });

  it('does not show the retired Surveys sidebar item', () => {
    render(
      <MemoryRouter initialEntries={['/friends']}>
        <SideMenu closeSideMenu={mockCloseSideMenu} />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Surveys')).not.toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalledWith('/surveys');
  });

  it('shows local reimbursement preview points on localhost when public totals are unavailable', () => {
    mockShouldUseLocalAllocationPreview.mockReturnValue(true);
    mockedUseSWR.mockImplementation((key: string | readonly [string, number | null] | null) => {
      if (key === '/surveys/index/') return { data: { available_now: [] } };
      if (key === '/surveys/reimbursement/') return { data: null };
      if (Array.isArray(key) && key[0] === 'local-reimbursement-allocation-preview') {
        return { data: { earnedPoints: 70 } };
      }
      if (key === '/user/version-switch-request/me/') return { data: { pending: false } };
      return { data: null };
    });

    render(
      <MemoryRouter initialEntries={['/surveys']}>
        <SideMenu closeSideMenu={mockCloseSideMenu} />
      </MemoryRouter>,
    );

    expect(screen.getByText('70 pts')).toBeInTheDocument();
  });
});
