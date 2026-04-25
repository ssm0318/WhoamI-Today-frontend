import { MouseEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CheckInDetailBottomSheet from '@components/check-in/check-in-detail-bottom-sheet/CheckInDetailBottomSheet';
import FriendPinnedChip from '@components/friends/friend-pinned-chip/FriendPinnedChip';
import PokeButton from '@components/friends/poke-button/PokeButton';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import NoteItem from '@components/note/note-item/NoteItem';
import EditConnectionsBottomSheet from '@components/profile/edit-connections/EditConnectionsBottomSheet';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { FeatureFlagKey } from '@constants/featureFlag';
import { Layout, SvgIcon, Typo } from '@design-system';
import { useCheckInSubscription } from '@hooks/useCheckInSubscription';
import { Connection, UpdatedProfile } from '@models/api/friends';
import { SocialBattery } from '@models/checkIn';
import { Note, POST_TYPE, Response } from '@models/post';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { Container, PostsScrollContainer, PostsScrollItem } from './FriendItemWithUpdates.styled';

interface Props {
  user: UpdatedProfile;
  onConnectionChanged?: (userId: number, connection: Connection) => void;
  tabMode?: 'check-in' | 'posts' | 'unified';
  hasNewPost?: boolean;
}

function FriendItemWithUpdates({
  user,
  onConnectionChanged,
  tabMode = 'check-in',
  hasNewPost = false,
}: Props) {
  const {
    id,
    profile_image,
    username,
    unread_chat_count,
    track_id,
    mood,
    social_battery,
    connection_status,
  } = user;
  const thought = (user as any).thought ?? '';

  const navigate = useNavigate();
  const [t] = useTranslation('translation');
  const { featureFlags } = useBoundStore(UserSelector);
  const checkInEnabled = !!featureFlags?.[FeatureFlagKey.CHECK_IN];

  const { isSubscribed, toggle: toggleCheckInSubscription } = useCheckInSubscription({
    userId: id,
    initialSubscribed: user.is_check_in_subscribed,
  });

  const handleToggleSubscription = (e: MouseEvent) => {
    e.stopPropagation();
    toggleCheckInSubscription();
  };

  const [isEditConnectionsBottomSheetVisible, setIsEditConnectionsBottomSheetVisible] =
    useState(false);
  const [checkInDetailFocus, setCheckInDetailFocus] = useState<
    'battery' | 'mood' | 'thought' | 'song' | null
  >(null);

  const handleClickProfile = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${username}`);
  };

  const handleClickChat = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${id}/chat`);
  };

  const handleClickFriendBadge = (e: MouseEvent) => {
    e.stopPropagation();
    if (featureFlags?.[FeatureFlagKey.FRIEND_REQUEST_TYPE]) {
      setIsEditConnectionsBottomSheetVisible(true);
    }
  };

  const hasCheckInContent = !!(track_id || mood || social_battery || thought);
  const hasUpdate = !user.current_user_read && hasCheckInContent;
  const showCheckInSection = tabMode === 'check-in' || tabMode === 'unified';
  const showPostsSection = tabMode === 'posts' || tabMode === 'unified';
  const showPings = tabMode === 'check-in';
  const showUpdateBadge = showCheckInSection && hasUpdate;
  const showNewBadge = tabMode === 'posts' && hasNewPost;

  const moodArray: string[] = Array.isArray(mood) ? mood : mood ? [mood] : [];
  const hasMood = moodArray.length > 0;
  const hasThought = !!thought;
  const hasBattery = !!social_battery && Object.values(SocialBattery).includes(social_battery);
  const hasSong = !!track_id;
  const pinnedCount = user.pinned_count ?? 0;

  const postsToShow = useMemo(
    () => (showPostsSection ? user.recent_posts ?? [] : []),
    [showPostsSection, user.recent_posts],
  );

  return (
    <Container mh={16} ph={16} pv={12} gap={8} rounded={12}>
      {/* Row 1: Profile + username + badge + battery | mood emojis + new post + chat */}
      <Layout.FlexRow w="100%" gap={4} alignItems="center" justifyContent="space-between">
        <Layout.FlexRow alignItems="center" gap={6} style={{ flex: 1, minWidth: 0 }}>
          <Layout.FlexRow
            alignItems="center"
            gap={6}
            onClick={handleClickProfile}
            style={{ cursor: 'pointer' }}
          >
            <ProfileImage imageUrl={profile_image} username={username} size={36} />
            <Typo type="label-large" ellipsis={{ enabled: true, maxWidth: 80 }}>
              {username}
            </Typo>
            <SvgIcon
              name={
                connection_status === Connection.CLOSE_FRIEND ? 'close_friend' : 'default_friend'
              }
              size={16}
              onClick={handleClickFriendBadge}
            />
          </Layout.FlexRow>

          {/* Battery + Mood emojis inline */}
          {(hasBattery || hasMood) && <Divider />}
          <Layout.FlexRow alignItems="center" gap={2}>
            {hasBattery && (
              <SocialBatteryChip
                socialBattery={social_battery}
                compact
                borderless
                onClick={() => setCheckInDetailFocus('battery')}
              />
            )}
            {hasBattery && hasMood && <Divider />}
            {hasMood && (
              <StackedEmojis onClick={() => setCheckInDetailFocus('mood')}>
                {moodArray.map((emoji, idx) => {
                  const dupeCount = moodArray.slice(0, idx).filter((e) => e === emoji).length;
                  return (
                    <StackedEmoji key={`${emoji}${dupeCount}`} $offset={idx}>
                      <EmojiItem
                        emojiString={emoji}
                        size={16}
                        bgColor="TRANSPARENT"
                        outline="TRANSPARENT"
                      />
                    </StackedEmoji>
                  );
                })}
              </StackedEmojis>
            )}
          </Layout.FlexRow>

          {showUpdateBadge && (
            <Layout.FlexRow
              pv={4}
              ph={8}
              rounded={8}
              style={{ backgroundColor: '#EEE6F4', flexShrink: 0 }}
            >
              <Typo type="label-large" color="PRIMARY" fontWeight={600}>
                Update
              </Typo>
            </Layout.FlexRow>
          )}
          {showNewBadge && (
            <Layout.FlexRow
              pv={4}
              ph={8}
              rounded={8}
              style={{ backgroundColor: '#EEE6F4', flexShrink: 0 }}
            >
              <Typo type="label-large" color="PRIMARY" fontWeight={600}>
                New
              </Typo>
            </Layout.FlexRow>
          )}
        </Layout.FlexRow>
        <Layout.FlexRow style={{ position: 'relative' }} alignItems="center" gap={12}>
          {checkInEnabled && tabMode !== 'unified' && (
            <button
              type="button"
              onClick={handleToggleSubscription}
              aria-label={
                t(
                  isSubscribed
                    ? 'check_in_subscription.aria.unsubscribe'
                    : 'check_in_subscription.aria.subscribe',
                ) ?? ''
              }
              style={{
                background: 'none',
                border: 'none',
                padding: 2,
                fontSize: 18,
                lineHeight: 1,
                cursor: 'pointer',
              }}
            >
              <EmojiItem
                emojiString={isSubscribed ? '🔔' : '🔕'}
                size={18}
                bgColor="TRANSPARENT"
                outline="TRANSPARENT"
              />
            </button>
          )}
          <Layout.LayoutBase pb={2}>
            <Icon name="friend_item_chat" color="BLACK" size={20} onClick={handleClickChat} />
          </Layout.LayoutBase>
          {unread_chat_count > 0 && (
            <Layout.Absolute
              bgColor="BLACK"
              alignItems="center"
              rounded={10}
              t={-3}
              r={6}
              ph={3}
              pv={1}
              tl={['100%', 0]}
            >
              <Typo type="label-small" color="WHITE" fontSize={7} fontWeight={700}>
                {unread_chat_count > 99 ? '99+' : unread_chat_count}
              </Typo>
            </Layout.Absolute>
          )}
        </Layout.FlexRow>
      </Layout.FlexRow>

      {showCheckInSection && (
        <>
          {/* Ping row for battery + mood if both empty — only in 'check-in' mode */}
          {showPings && (!hasBattery || !hasMood) && (
            <Layout.FlexRow gap={4} style={{ flexWrap: 'wrap' }}>
              {!hasBattery && (
                <PokeButton
                  receiverId={id}
                  componentType="battery"
                  initialPokeId={user.sent_pokes?.battery ?? null}
                />
              )}
              {!hasMood && (
                <PokeButton
                  receiverId={id}
                  componentType="mood"
                  initialPokeId={user.sent_pokes?.mood ?? null}
                />
              )}
            </Layout.FlexRow>
          )}

          {/* Thought pill — leading 💭 emoji; empty only shows poke in check-in tab (hidden in unified). */}
          {hasThought ? (
            <Layout.FlexRow
              bgColor="WHITE"
              pv={4}
              ph={8}
              gap={4}
              outline="LIGHT_GRAY"
              alignItems="center"
              rounded={8}
              style={{ flexShrink: 0, cursor: 'pointer', alignSelf: 'flex-start' }}
              onClick={() => setCheckInDetailFocus('thought')}
            >
              <span style={{ fontSize: 14, lineHeight: 1 }} aria-hidden>
                💭
              </span>
              <Typo type="label-large" numberOfLines={1}>
                {thought}
              </Typo>
            </Layout.FlexRow>
          ) : (
            showPings && (
              <PokeButton
                receiverId={id}
                componentType="thought"
                initialPokeId={user.sent_pokes?.thought ?? null}
              />
            )
          )}

          {/* Song — in 'unified' mode, hide when empty (no ping) */}
          {hasSong ? (
            <Layout.FlexRow w="100%" style={{ minWidth: 0, overflow: 'hidden' }}>
              <SpotifyMusic
                track={track_id}
                sharer={user}
                fontType="label-large"
                useAlbumImg
                onClick={() => setCheckInDetailFocus('song')}
              />
            </Layout.FlexRow>
          ) : (
            showPings && (
              <PokeButton
                receiverId={id}
                componentType="song"
                initialPokeId={user.sent_pokes?.song ?? null}
              />
            )
          )}
        </>
      )}

      {showPostsSection && postsToShow.length > 0 && (
        <>
          <Typo type="label-large" color="BLACK" fontWeight={600}>
            Recent Posts
          </Typo>
          <PostsScrollContainer gap={8}>
            {postsToShow.map((post) => (
              <PostsScrollItem key={`${post.type}-${post.id}`}>
                {post.type === POST_TYPE.NOTE ? (
                  <NoteItem
                    note={post as Note}
                    isMyPage={false}
                    displayType="FEED"
                    profileImageSize={32}
                    previewMode
                  />
                ) : (
                  <ResponseItem
                    response={post as Response}
                    isMyPage={false}
                    displayType="FEED"
                    profileImageSize={32}
                    previewMode
                  />
                )}
              </PostsScrollItem>
            ))}
          </PostsScrollContainer>
        </>
      )}

      {/* Pinned Check-ins chip — always renders (including N=0) so the
          affordance sits at a predictable position on every friend card. */}
      <Layout.FlexRow w="100%" alignSelf="flex-start">
        <FriendPinnedChip pinnedCount={pinnedCount} to={`/users/${username}/check-in/pinned`} />
      </Layout.FlexRow>

      {/* Check-in detail popup */}
      <CheckInDetailBottomSheet
        visible={!!checkInDetailFocus}
        closeBottomSheet={() => setCheckInDetailFocus(null)}
        focusComponent={checkInDetailFocus}
        checkInId={user.check_in_id}
        username={username}
        profileImage={profile_image}
        socialBattery={social_battery}
        mood={moodArray}
        description={thought}
        trackId={track_id}
      />

      <EditConnectionsBottomSheet
        user={user as unknown as UserProfile}
        visible={isEditConnectionsBottomSheetVisible}
        closeBottomSheet={() => setIsEditConnectionsBottomSheetVisible(false)}
        onConnectionChanged={(connection) => {
          onConnectionChanged?.(user.id, connection);
        }}
      />
    </Container>
  );
}

const StackedEmojis = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 2px 0;
`;

const StackedEmoji = styled.span<{ $offset: number }>`
  font-size: 16px;
  line-height: 1;
  margin-left: ${({ $offset }) => ($offset > 0 ? '-4px' : '0')};
  z-index: ${({ $offset }) => 5 - $offset};
  position: relative;
`;

const Divider = styled.span`
  width: 1px;
  height: 14px;
  background-color: #d9d9d9;
  margin: 0 2px;
  flex-shrink: 0;
`;

export default FriendItemWithUpdates;
