/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import useSWR from 'swr';

import Discover from './Discover';

jest.mock('swr');

const mockStoreState = {
  myProfile: {
    id: 1,
    username: 'tester',
    username_history: ['tester'],
    chips_by_category: {},
    custom_chips: [],
    profile_image: 'profile.png',
    pronouns: 'they/them',
    bio: 'bio',
  },
  featureFlags: {
    postsVerQ: true,
  },
  activeBrowseMode: null,
};

const mockDiscoverData = [
  {
    results: [
      {
        type: 'Note',
        body: {
          id: 10,
          content: 'Middle public note',
        },
      },
      {
        type: 'Question',
        body: {
          id: 1,
          content: 'First public highlight',
          created_at: '2026-05-18T10:00:00Z',
          selected_dates: ['2026-05-18'],
          is_admin_question: true,
        },
      },
      {
        type: 'Response',
        body: {
          id: 20,
          content: 'Middle public response',
        },
      },
      {
        type: 'Question',
        body: {
          id: 2,
          content: 'Second public highlight',
          created_at: '2026-05-18T11:00:00Z',
          selected_dates: ['2026-05-18'],
          is_admin_question: true,
        },
      },
    ],
  },
];

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
      myProfile: state.myProfile,
    }),
  }),
  { virtual: true },
);

jest.mock(
  '@hooks/useSWRInfiniteScroll',
  () => ({
    useSWRInfiniteScroll: () => ({
      targetRef: jest.fn(),
      data: mockDiscoverData,
      isLoadingMore: false,
      isLoading: false,
      isEndPage: true,
      mutate: jest.fn(),
    }),
  }),
  { virtual: true },
);

jest.mock('react-i18next', () => ({
  useTranslation: () => [(key: string) => key],
}));

jest.mock(
  '@i18n/index',
  () => ({
    __esModule: true,
    default: { language: 'en' },
  }),
  { virtual: true },
);

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
  '@constants/layout',
  () => ({
    DEFAULT_MARGIN: 16,
  }),
  { virtual: true },
);

jest.mock(
  '@constants/surveyPause',
  () => ({
    isSurveysPaused: () => false,
  }),
  { virtual: true },
);

jest.mock(
  '@components/header/floating-button/FloatingButton.styled',
  () => ({
    FLOATING_BUTTON_SIZE: 56,
  }),
  { virtual: true },
);

jest.mock(
  '@models/discover',
  () => ({
    DiscoverFilter: {
      MUTUAL_FRIENDS: 'mutual_friends',
      MUTUAL_TRAITS: 'mutual_traits',
    },
    DiscoverFilterLabel: {
      mutual_friends: 'Mutual Friends',
      mutual_traits: 'Mutual Traits',
    },
  }),
  { virtual: true },
);

jest.mock(
  '@hooks/useChipCategories',
  () => ({
    useChipCategories: () => ({ categories: [] }),
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

jest.mock(
  '@hooks/useSaveAndHide',
  () => ({
    useSaveAndHide: () => ({
      isSaved: false,
      showCard: false,
      isAnimating: false,
      handleSave: jest.fn(),
    }),
  }),
  { virtual: true },
);

jest.mock(
  '@hooks/useScrollDepth',
  () => ({
    useScrollDepth: jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  '@hooks/useTrackEvent',
  () => ({
    useTrackEvent: () => jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  '@utils/sessionStorage',
  () => ({
    getItemFromSessionStorage: () => [],
    setItemToSessionStorage: jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  '@utils/apis/discover',
  () => ({
    getDiscoverFeed: jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  '@utils/apis/my',
  () => ({
    getMe: jest.fn(),
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
    getPastSurveys: jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  '@components/_common/filter-chip/FilterChip',
  () =>
    function MockFilterChip({ label }: { label: string }) {
      return <button type="button">{label}</button>;
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
  '@components/discover/HighlightQuestionSection/HighlightQuestionSection',
  () =>
    function MockHighlightQuestionSection({ question }: { question: string }) {
      return <article>highlight: {question}</article>;
    },
  { virtual: true },
);

jest.mock(
  '@components/discover/ProfileSuggestionCard/ProfileSuggestionCard',
  () =>
    function MockProfileSuggestionCard() {
      return <article>profile suggestion</article>;
    },
  { virtual: true },
);

jest.mock(
  '@components/discover/SelectInterestSection/SelectInterestSection',
  () =>
    function MockSelectInterestSection() {
      return <article>interest</article>;
    },
  { virtual: true },
);

jest.mock(
  '@components/discover/SelectPersonaSection/SelectPersonaSection',
  () =>
    function MockSelectPersonaSection() {
      return <article>persona</article>;
    },
  { virtual: true },
);

jest.mock(
  '@components/discover/SurveyPausedCard/SurveyPausedCard',
  () =>
    function MockSurveyPausedCard() {
      return <article>survey paused</article>;
    },
  { virtual: true },
);

jest.mock(
  '@components/discover/SurveyResultsCard/SurveyResultsCard',
  () =>
    function MockSurveyResultsCard() {
      return <article>survey results</article>;
    },
  { virtual: true },
);

jest.mock(
  '@components/discover/UsernameSuggestionCard/UsernameSuggestionCard',
  () =>
    function MockUsernameSuggestionCard() {
      return <article>username suggestion</article>;
    },
  { virtual: true },
);

jest.mock(
  '@components/friends/shared-playlist/SharedPlaylistSection',
  () =>
    function MockSharedPlaylistSection() {
      return <article>shared playlist</article>;
    },
  { virtual: true },
);

jest.mock(
  '@components/note/mission-group-item/MissionGroupItem',
  () =>
    function MockMissionGroupItem() {
      return <article>mission group</article>;
    },
  { virtual: true },
);

jest.mock(
  '@components/note/note-item/NoteItem',
  () =>
    function MockNoteItem({ note }: { note: { content: string } }) {
      return <article>note: {note.content}</article>;
    },
  { virtual: true },
);

jest.mock(
  '@components/note/note-loader/NoteLoader',
  () =>
    function MockNoteLoader() {
      return <article>loading</article>;
    },
  { virtual: true },
);

jest.mock(
  '@components/response/response-item/ResponseItem',
  () =>
    function MockResponseItem({ response }: { response: { content: string } }) {
      return <article>response: {response.content}</article>;
    },
  { virtual: true },
);

jest.mock(
  'src/routes/Root',
  () => ({
    MainScrollContainer: ({ children }: { children?: ReactNode }) => <main>{children}</main>,
  }),
  { virtual: true },
);

jest.mock('./Discover.styled', () => {
  const React = jest.requireActual<typeof import('react')>('react');

  function MockWrapper({ children, ...props }: { children?: ReactNode }) {
    return React.createElement('div', props, children);
  }

  return {
    HideScrollbarGlobalStyle: () => null,
    ScrollableFilterRow: MockWrapper,
    AnimatedCardWrapper: MockWrapper,
  };
});

jest.mock('./DiscoverW', () => ({
  __esModule: true,
  default: function MockDiscoverW() {
    return <div>Discover W</div>;
  },
}));

const mockedUseSWR = useSWR as unknown as jest.Mock;

describe('Discover', () => {
  beforeEach(() => {
    mockedUseSWR.mockReturnValue({});
  });

  it('shows all public highlights above regular discover posts on ver.q', () => {
    render(
      <MemoryRouter>
        <Discover />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('article').map((item) => item.textContent)).toEqual([
      'highlight: First public highlight',
      'highlight: Second public highlight',
      'note: Middle public note',
      'response: Middle public response',
    ]);
  });
});
