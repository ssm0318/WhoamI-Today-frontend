/* eslint-env jest */

import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { CheckInPostStory } from '@models/checkInPost';
import SnippetAvatarBubble from './SnippetAvatarBubble';

jest.mock(
  '@components/_common/profile-image/ProfileImage',
  () =>
    function MockProfileImage({ username }: { username: string }) {
      return <img alt={username} />;
    },
  { virtual: true },
);

jest.mock(
  '@design-system',
  () => ({
    Colors: {
      PRIMARY: '#8700FF',
      TERTIARY_PINK: '#FF00A8',
      UPDATED: '#0072EC',
      BLACK: '#000000',
      LIGHT_GRAY: '#D9D9D9',
      WHITE: '#FFFFFF',
    },
    SvgIcon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
    Typo: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
  }),
  { virtual: true },
);

const makeStory = (
  id: number,
  visibility: CheckInPostStory['visibility'],
  username: string,
): CheckInPostStory => ({
  id,
  author_detail: {
    id,
    username,
    profile_image: null,
  } as CheckInPostStory['author_detail'],
  image_url: null,
  caption: '',
  visibility,
  is_pinned: false,
  pin_visibility: null,
  created_at: '2026-05-18T10:00:00Z',
  has_unread: true,
});

describe('SnippetAvatarBubble', () => {
  it('keeps visibility icons off profile photos and only labels close-friend privacy', () => {
    render(
      <>
        <SnippetAvatarBubble story={makeStory(1, 'friends', 'friend_author')} onClick={jest.fn()} />
        <SnippetAvatarBubble
          story={makeStory(2, 'close_friends', 'close_author')}
          onClick={jest.fn()}
        />
        <SnippetAvatarBubble story={makeStory(3, 'public', 'public_author')} onClick={jest.fn()} />
      </>,
    );

    expect(
      screen.getByRole('button', { name: 'close_author close friends snapshot' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'public_author daily snapshot' }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('icon-default_friend')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-close_friend')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-eye')).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Public snapshot' })).not.toBeInTheDocument();
  });
});
