/* eslint-env jest */

import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

const mockEditProfile = jest.fn();
const mockUpdateMyProfile = jest.fn();
const mockOpenToast = jest.fn();
let mockNotiPermission = 'granted';

const mockProfile = {
  noti_time: '16:00',
  noti_period_days: ['0', '1'],
  push_enabled: true,
  daily_prompt_push_enabled: true,
};

const mockState = {
  appNotiPermission: true,
  myProfile: mockProfile,
  updateMyProfile: mockUpdateMyProfile,
  openToast: mockOpenToast,
};

jest.mock(
  '@stores/useBoundStore',
  () => ({
    useBoundStore: (selector: (state: typeof mockState) => unknown) => selector(mockState),
  }),
  { virtual: true },
);

jest.mock(
  '@utils/apis/my',
  () => ({
    editProfile: (args: unknown) => mockEditProfile(args),
  }),
  { virtual: true },
);

jest.mock(
  '@hooks/useNotiPermission',
  () => () => ({
    getSettingDescription: () => [],
    notiPermission: mockNotiPermission,
    setNotiPermission: jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  '@utils/firebaseHelpers',
  () => ({
    requestPermission: jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  '@utils/getUserAgent',
  () => ({
    isApp: false,
  }),
  { virtual: true },
);

jest.mock(
  '@components/_common/toggle-switch/ToggleSwitch',
  () => ({
    ToggleSwitch: ({
      ariaLabel,
      checked,
      disabled,
      onChange,
    }: {
      ariaLabel?: string;
      checked: boolean;
      disabled?: boolean;
      onChange: () => void;
    }) => (
      <input
        aria-label={ariaLabel}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        type="checkbox"
      />
    ),
  }),
  { virtual: true },
);

jest.mock(
  '@components/settings/SettingsButtons',
  () => ({
    PushNotiSettingButton: ({ onClick, text }: { onClick: () => void; text: string }) => (
      <button onClick={onClick} type="button">
        {text}
      </button>
    ),
    SettingsToggleButton: ({ permissionAllowed }: { permissionAllowed: boolean }) => (
      <input
        aria-label="System push permission"
        checked={permissionAllowed}
        readOnly
        type="checkbox"
      />
    ),
  }),
  { virtual: true },
);

jest.mock('../SettingsButtons', () => ({
  PushNotiSettingButton: ({ onClick, text }: { onClick: () => void; text: string }) => (
    <button onClick={onClick} type="button">
      {text}
    </button>
  ),
  SettingsToggleButton: ({ permissionAllowed }: { permissionAllowed: boolean }) => (
    <input
      aria-label="System push permission"
      checked={permissionAllowed}
      readOnly
      type="checkbox"
    />
  ),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => [
    (key: string) => {
      const translations: Record<string, string> = {
        push_notifications: 'Push notifications',
        all_push_notifications: 'All push notifications',
        all_push_notifications_desc: 'Receive every push notification from WhoAmI Today.',
        daily_prompt_notifications: 'Daily prompts',
        daily_prompt_notifications_desc: 'Reminders to share or complete the daily survey.',
        'daily_noti_setting.title': 'Notification timing',
        'daily_noti_setting.success': 'Changes updated successfully',
        'daily_noti_setting.error': 'A temporary error occurred.',
      };
      return translations[key] ?? key;
    },
  ],
}));

jest.mock(
  '@design-system',
  () => {
    const React = jest.requireActual<typeof import('react')>('react');

    function MockLayout({ children }: { children?: ReactNode }) {
      return React.createElement('div', null, children);
    }

    function MockText({ children }: { children?: ReactNode }) {
      return React.createElement('span', null, children);
    }

    function MockIcon({ name }: { name: string }) {
      return <span aria-hidden="true" data-testid={`icon-${name}`} />;
    }

    return {
      Font: { Body: MockText, Display: MockText },
      Layout: {
        FlexCol: MockLayout,
        FlexRow: MockLayout,
      },
      SvgIcon: MockIcon,
    };
  },
  { virtual: true },
);

// Require after mocks so this component's aliased dependencies are replaced in Jest.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PushNotiSetting = require('./PushNotiSetting').default;

describe('PushNotiSetting', () => {
  beforeEach(() => {
    mockNotiPermission = 'granted';
    mockEditProfile.mockClear();
    mockUpdateMyProfile.mockClear();
    mockOpenToast.mockClear();
  });

  it('lets users turn off all push notifications without deactivating the device token', () => {
    render(
      <MemoryRouter>
        <PushNotiSetting />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'All push notifications' }));

    expect(mockEditProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        profile: { push_enabled: false },
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
  });

  it('lets users turn off only daily prompt pushes', () => {
    render(
      <MemoryRouter>
        <PushNotiSetting />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Daily prompts' }));

    expect(mockEditProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        profile: { daily_prompt_push_enabled: false },
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
  });

  it('lets users save daily prompt push preferences when system permission is denied', () => {
    mockNotiPermission = 'denied';

    render(
      <MemoryRouter>
        <PushNotiSetting />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Daily prompts' }));

    expect(mockEditProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        profile: { daily_prompt_push_enabled: false },
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
  });
});
