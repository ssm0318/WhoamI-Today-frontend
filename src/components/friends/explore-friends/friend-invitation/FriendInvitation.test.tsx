/* eslint-env jest */

import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import FriendInvitation from './FriendInvitation';

const mockState = {
  myProfile: {
    username: 'adoor_1',
    invite_code: 'ABC123',
  },
};

jest.mock('react-i18next', () => ({
  useTranslation: () => [
    (key: string, options?: Record<string, string>) => {
      const translations: Record<string, string> = {
        text: 'Invite Friends',
        copy: 'Invitation link copied to clipboard.',
        copy_code_text: 'Copy invite code',
        copy_code_copied: 'Invite code copied to clipboard.',
        code_disclaimer: 'Only share your invite code with people you really trust.',
        desktop_message:
          'Invitation link: {{invitation_link}}\nInvite code: {{invite_code}}\nMy username: {{username}}',
        mobile_message_title: 'Join me on WhoAmI Today (WIT).',
        mobile_message:
          'Invitation link: {{invitation_link}}\nInvite code: {{invite_code}}\nMy username: {{username}}',
      };
      return (translations[key] ?? key).replace(
        /\{\{(\w+)\}\}/g,
        (_, token) => options?.[token] ?? '',
      );
    },
  ],
}));

jest.mock(
  '@components/_common/toast-message/ToastMessage',
  () =>
    function MockToastMessage({ text }: { text: string }) {
      return <div role="status">{text}</div>;
    },
  { virtual: true },
);

jest.mock(
  '@constants/url',
  () => ({
    INVITATION_LINK: 'https://whoamitoday.page.link/invite-friend',
  }),
  { virtual: true },
);

jest.mock(
  '@design-system',
  () => {
    const React = jest.requireActual<typeof import('react')>('react');
    function MockLayout(
      props: {
        children?: ReactNode;
        as?: string;
      } & Record<string, unknown>,
    ) {
      const { children, as = 'div' } = props;
      return React.createElement(as, null, children);
    }
    function MockIcon({ name }: { name: string }) {
      return <span aria-hidden="true">{name}</span>;
    }
    function MockText({ children }: { children?: ReactNode }) {
      return <span>{children}</span>;
    }

    return {
      Colors: {
        INPUT_GRAY: '#efefef',
      },
      Font: { Body: MockText },
      Layout: {
        FlexCol: MockLayout,
        FlexRow: MockLayout,
      },
      SvgIcon: MockIcon,
      Typo: MockText,
    };
  },
  { virtual: true },
);

jest.mock(
  '@stores/useBoundStore',
  () => ({
    useBoundStore: (selector: (state: typeof mockState) => unknown) => selector(mockState),
  }),
  { virtual: true },
);

jest.mock(
  '@utils/getUserAgent',
  () => ({
    getMobileDeviceInfo: () => ({ isMobile: false }),
  }),
  { virtual: true },
);

jest.mock(
  '@utils/urlHelpers',
  () => ({
    decodeHTMLEntities: (value: string) => value,
  }),
  { virtual: true },
);

describe('FriendInvitation', () => {
  const writeText = jest.fn();

  beforeEach(() => {
    mockState.myProfile = {
      username: 'adoor_1',
      invite_code: 'ABC123',
    };
    writeText.mockReset();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
  });

  it('copies the full invitation message from the invite action', () => {
    render(<FriendInvitation />);

    fireEvent.click(screen.getByRole('button', { name: /invite friends/i }));

    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('whoami://app/signup/email/invite-code/ABC123'),
    );
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Invite code: ABC123'));
    expect(screen.getByRole('status')).toHaveTextContent('Invitation link copied to clipboard.');
  });

  it('copies only the invite code from the code action', () => {
    render(<FriendInvitation />);

    fireEvent.click(screen.getByRole('button', { name: /copy invite code abc123/i }));

    expect(writeText).toHaveBeenCalledWith('ABC123');
    expect(screen.getByRole('status')).toHaveTextContent('Invite code copied to clipboard.');
  });

  it('hides the code-only action when no invite code exists', () => {
    mockState.myProfile = {
      username: 'adoor_1',
      invite_code: '',
    };

    render(<FriendInvitation />);

    expect(screen.queryByRole('button', { name: /copy invite code/i })).not.toBeInTheDocument();
    expect(
      screen.queryByText('Only share your invite code with people you really trust.'),
    ).not.toBeInTheDocument();
  });
});
