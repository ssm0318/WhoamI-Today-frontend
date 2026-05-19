/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import useSWR from 'swr';

import Share from './Share';

jest.mock('swr');

const mockStoreState = {
  featureFlags: {
    shareTabVisible: true,
    postsVerQ: true,
  },
};

jest.mock(
  '@stores/useBoundStore',
  () => ({
    useBoundStore: (selector?: (state: typeof mockStoreState) => unknown) =>
      selector ? selector(mockStoreState) : mockStoreState,
  }),
  { virtual: true },
);

jest.mock(
  '@stores/user',
  () => ({
    UserSelector: (state: typeof mockStoreState) => ({
      featureFlags: state.featureFlags,
    }),
  }),
  { virtual: true },
);

jest.mock(
  '@constants/layout',
  () => ({
    DEFAULT_MARGIN: 16,
  }),
  { virtual: true },
);

jest.mock(
  '@hooks/useRestoreScrollPosition',
  () => ({
    useRestoreScrollPosition: () => ({ scrollRef: undefined }),
  }),
  { virtual: true },
);

jest.mock('react-i18next', () => ({
  useTranslation: () => [
    (key: string) => {
      if (key === 'share_page.daily_update_notice_q') return 'Q daily notice';
      if (key === 'share_page.daily_update_notice') return 'Daily notice';
      if (key === 'share_page.about_me') return 'About Me';
      if (key === 'share_page.about_me_description') return 'About me description';
      if (key === 'share_page.create_post') return 'Create post';
      return key;
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

    function MockTypo({ children }: { children?: ReactNode }) {
      return React.createElement('span', null, children);
    }

    return {
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
  '@components/_common/pull-to-refresh/PullToRefresh',
  () =>
    function MockPullToRefresh({ children }: { children?: ReactNode }) {
      return <div>{children}</div>;
    },
  { virtual: true },
);

jest.mock(
  '@components/share/QuickShareInput',
  () =>
    function MockQuickShareInput() {
      return <button type="button">Regular post sharing</button>;
    },
  { virtual: true },
);

jest.mock(
  '@components/share/CheckInPostShareCta',
  () =>
    function MockCheckInPostShareCta() {
      return <section data-testid="daily-snippet">Daily snippet</section>;
    },
  { virtual: true },
);

jest.mock(
  '@components/share/SurveyOfTheDay',
  () =>
    function MockSurveyOfTheDay() {
      return <section>Survey of the day</section>;
    },
  { virtual: true },
);

jest.mock(
  '@components/share/QuestionsOfTheDaySection',
  () =>
    function MockQuestionsOfTheDaySection() {
      return <section>Questions of the day</section>;
    },
  { virtual: true },
);

jest.mock(
  '@components/share/MissionOfTheDay',
  () => ({
    __esModule: true,
    default: function MockMissionOfTheDay() {
      return <section>Mission of the day</section>;
    },
  }),
  { virtual: true },
);

jest.mock('../Root', () => ({
  MainScrollContainer: ({ children }: { children?: ReactNode }) => <main>{children}</main>,
}));

jest.mock(
  '@utils/apis/my',
  () => ({
    getMe: jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  '@utils/apis/question',
  () => ({
    getTodayQuestions: jest.fn(),
  }),
  { virtual: true },
);

const mockedUseSWR = useSWR as unknown as jest.Mock;

describe('Share', () => {
  beforeEach(() => {
    mockedUseSWR.mockReturnValue({ mutate: jest.fn() });
  });

  it('shows regular post sharing above the daily snippet on ver.q', () => {
    const { container } = render(
      <MemoryRouter>
        <Share />
      </MemoryRouter>,
    );

    const regularPostSharing = screen.getByRole('button', { name: 'Regular post sharing' });
    const dailySnippet = screen.getByTestId('daily-snippet');
    const orderedItems = Array.from(container.querySelectorAll('button, section'));

    expect(regularPostSharing).toBeInTheDocument();
    expect(orderedItems.indexOf(regularPostSharing)).toBeLessThan(
      orderedItems.indexOf(dailySnippet),
    );
  });
});
