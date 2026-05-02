import { MouseEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// TODO: hide friend 기능 임시 비활성화 (2026-05-02). 복구시 주석 해제.
// import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CheckInDetailBottomSheet from '@components/check-in/check-in-detail-bottom-sheet/CheckInDetailBottomSheet';
import PokeButton from '@components/friends/poke-button/PokeButton';
import SubscriptionPopup from '@components/friends/subscription-popup/SubscriptionPopup';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import NoteItem from '@components/note/note-item/NoteItem';
import EditConnectionsBottomSheet from '@components/profile/edit-connections/EditConnectionsBottomSheet';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { FeatureFlagKey } from '@constants/featureFlag';
import { Layout, SvgIcon, Typo } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { Connection, UpdatedProfile } from '@models/api/friends';
import { SocialBattery } from '@models/checkIn';
import { Note, POST_TYPE, Response } from '@models/post';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
// TODO: hide friend 기능 임시 비활성화 (2026-05-02). 복구시 주석 해제.
// import { hideFriend } from '@utils/apis/friends';
import {
  Container,
  EmptyPostsContainer,
  PostsScrollContainer,
  PostsScrollItem,
} from './FriendItemWithUpdates.styled';

interface Props {
  user: UpdatedProfile;
  onConnectionChanged?: (userId: number, connection: Connection) => void;
  onSubscriptionChanged?: (userId: number, hasSubscription: boolean) => void;
  // TODO: hide friend 기능 임시 비활성화 (2026-05-02). 복구시 사용 재개.
  // eslint-disable-next-line react/no-unused-prop-types
  onHidden?: (userId: number) => void;
  tabMode?: 'check-in' | 'posts' | 'unified';
  hasNewPost?: boolean;
}

function FriendItemWithUpdates({
  user,
  onConnectionChanged,
  onSubscriptionChanged,
  // TODO: hide friend 기능 임시 비활성화 (2026-05-02). 복구시 주석 해제.
  // onHidden,
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
  const { featureFlags, myProfile } = useBoundStore(UserSelector);
  const subscriptionPopupEnabled = !!featureFlags?.[FeatureFlagKey.SUBSCRIPTION_POPUP];

  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const handleOpenSubscriptionPopup = (e: MouseEvent) => {
    e.stopPropagation();
    setShowSubscriptionPopup(true);
  };
  const handleCloseSubscriptionPopup = () => setShowSubscriptionPopup(false);

  // TODO: hide friend 기능 임시 비활성화 (2026-05-02). 복구시 주석 해제.
  /*
  const [showHideConfirm, setShowHideConfirm] = useState(false);
  const handleOpenHideConfirm = (e: MouseEvent) => {
    e.stopPropagation();
    setShowHideConfirm(true);
  };
  const handleCloseHideConfirm = () => setShowHideConfirm(false);
  const handleConfirmHide = async () => {
    setShowHideConfirm(false);
    try {
      await hideFriend(id);
      onHidden?.(id);
    } catch {
      // parent handler may show toast / refetch on failure
    }
  };
  */

  const [isEditConnectionsBottomSheetVisible, setIsEditConnectionsBottomSheetVisible] =
    useState(false);
  const [checkInDetailFocus, setCheckInDetailFocus] = useState<
    'battery' | 'mood' | 'thought' | 'song' | null
  >(null);
  const trackEvent = useTrackEvent();

  // Wraps setCheckInDetailFocus(...) for the OPEN paths (the close path
  // calls setCheckInDetailFocus(null) and shouldn't fire). Each open is a
  // discrete user action — no de-dup, even if the same component is
  // opened multiple times in a row, because each tap is itself a signal.
  // friend_id is included so dashboards can answer 'how often does the
  // user inspect each friend's check-in?'; it's a numeric id, not PII.
  const openCheckInDetail = (component: 'battery' | 'mood' | 'thought' | 'song') => {
    trackEvent('friend_check_in_component_opened', {
      component,
      friend_id: id,
      is_close_friend: user.connection_status === Connection.CLOSE_FRIEND ? 'true' : 'false',
    });
    setCheckInDetailFocus(component);
  };

  const handleClickProfile = (e: MouseEvent) => {
    e.stopPropagation();
    // Tag profile nav with source so UserPage knows the user came from the
    // Friends list (vs Discover, vs shared playlist, vs search).
    navigate(`/users/${username}`, { state: { source: 'friends_list' } });
  };

  const handleClickChat = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${id}/chat`);
  };

  const handleClickFriendBadge = (e: MouseEvent) => {
    e.stopPropagation();
    setIsEditConnectionsBottomSheetVisible(true);
  };

  const hasCheckInContent = !!(track_id || mood || social_battery || thought);
  const hasUpdate = !user.current_user_read_check_in && hasCheckInContent;
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

  const postsToShow = useMemo(
    () => (showPostsSection ? user.recent_posts ?? [] : []),
    [showPostsSection, user.recent_posts],
  );

  return (
    <Container mh={16} ph={16} pv={12} gap={8} rounded={12}>
      {/* Row 1: Header — profile + username + badge | subscribe + chat */}
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
        </Layout.FlexRow>
        <Layout.FlexRow alignItems="center" gap={12}>
          {subscriptionPopupEnabled && tabMode !== 'unified' && (
            <>
              <button
                type="button"
                onClick={handleOpenSubscriptionPopup}
                aria-label={t('check_in_subscription.aria.subscribe') ?? ''}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 2,
                  cursor: 'pointer',
                  display: 'inline-flex',
                }}
              >
                <SvgIcon
                  name="notification_inline"
                  size={20}
                  color={user.is_subscribed ? 'PRIMARY' : 'BLACK'}
                  fill={user.is_subscribed ? 'PRIMARY' : undefined}
                />
              </button>
              <SubscriptionPopup
                isOpen={showSubscriptionPopup}
                onClose={handleCloseSubscriptionPopup}
                friendId={id}
                username={username}
                currentVersion={myProfile?.current_ver}
                onSubscriptionChange={(hasSubscription) =>
                  onSubscriptionChanged?.(id, hasSubscription)
                }
              />
            </>
          )}
          <Layout.LayoutBase pb={2} style={{ position: 'relative' }}>
            <Icon name="friend_item_chat" color="BLACK" size={20} onClick={handleClickChat} />
            {unread_chat_count > 0 && (
              <Layout.Absolute
                bgColor="SECONDARY"
                alignItems="center"
                rounded={10}
                t={-3}
                r={-6}
                ph={3}
                pv={1}
              >
                <Typo type="label-small" color="BLACK" fontSize={7} fontWeight={700}>
                  {unread_chat_count > 99 ? '99+' : unread_chat_count}
                </Typo>
              </Layout.Absolute>
            )}
          </Layout.LayoutBase>
          {/* TODO: hide friend 기능 임시 비활성화 (2026-05-02). 복구시 주석 해제. */}
          {/*
          {tabMode !== 'unified' && (
            <button
              type="button"
              onClick={handleOpenHideConfirm}
              aria-label={t('friend.hide_aria') ?? ''}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                marginLeft: -4,
                cursor: 'pointer',
                display: 'inline-flex',
              }}
            >
              <SvgIcon name="view" size={28} color="BLACK" />
            </button>
          )}
          */}
        </Layout.FlexRow>
      </Layout.FlexRow>

      {/* Row 2: Update + New badges */}
      {(showUpdateBadge || showNewBadge) && (
        <Layout.FlexRow gap={4} alignItems="center" style={{ flexWrap: 'wrap' }}>
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
      )}

      {showCheckInSection && (
        <>
          {/* Battery + Mood — always together on the same row (chip if filled, ping if empty) */}
          {(showPings || hasBattery || hasMood) && (
            <Layout.FlexRow gap={4} alignItems="center" style={{ flexWrap: 'wrap' }}>
              {hasBattery ? (
                <SocialBatteryChip
                  socialBattery={social_battery}
                  compact
                  onClick={() => openCheckInDetail('battery')}
                />
              ) : (
                showPings && (
                  <PokeButton
                    receiverId={id}
                    componentType="battery"
                    initialPokeId={user.sent_pokes?.battery ?? null}
                  />
                )
              )}
              {hasMood ? (
                <Layout.FlexRow
                  bgColor="WHITE"
                  pv={4}
                  ph={8}
                  outline="LIGHT_GRAY"
                  alignItems="center"
                  rounded={8}
                  style={{ flexShrink: 0, cursor: 'pointer' }}
                  onClick={() => openCheckInDetail('mood')}
                >
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
                </Layout.FlexRow>
              ) : (
                showPings && (
                  <PokeButton
                    receiverId={id}
                    componentType="mood"
                    initialPokeId={user.sent_pokes?.mood ?? null}
                  />
                )
              )}
            </Layout.FlexRow>
          )}

          {/* Thought pill — leading 🤪 emoji; empty only shows poke in check-in tab (hidden in unified). */}
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
              onClick={() => openCheckInDetail('thought')}
            >
              <span style={{ fontSize: 14, lineHeight: 1 }} aria-hidden>
                🤪
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
                onClick={() => openCheckInDetail('song')}
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

      {showPostsSection && (
        <>
          <Typo type="label-large" color="BLACK" fontWeight={600} mt={4}>
            Recent Posts
          </Typo>
          {postsToShow.length > 0 ? (
            <PostsScrollContainer gap={8}>
              {postsToShow.map((post) => (
                <PostsScrollItem key={`${post.type}-${post.id}`}>
                  {post.type === POST_TYPE.NOTE ? (
                    <NoteItem
                      note={post as Note}
                      isMyPage={false}
                      displayType="LIST"
                      profileImageSize={32}
                      previewMode
                    />
                  ) : (
                    <ResponseItem
                      response={post as Response}
                      isMyPage={false}
                      displayType="LIST"
                      profileImageSize={32}
                      previewMode
                    />
                  )}
                </PostsScrollItem>
              ))}
            </PostsScrollContainer>
          ) : (
            <EmptyPostsContainer>
              <Typo type="body-medium" color="MEDIUM_GRAY">
                No Recent Posts
              </Typo>
            </EmptyPostsContainer>
          )}
        </>
      )}

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

      {/* TODO: hide friend 기능 임시 비활성화 (2026-05-02). 복구시 주석 해제. */}
      {/*
      <CommonDialog
        visible={showHideConfirm}
        title={t('friend.hide_confirm_title')}
        cancelText={t('common.cancel')}
        confirmText={t('friend.hide_confirm_action')}
        onClickConfirm={handleConfirmHide}
        onClickClose={handleCloseHideConfirm}
      />
      */}
    </Container>
  );
}

const StackedEmoji = styled.span<{ $offset: number }>`
  font-size: 16px;
  line-height: 1;
  margin-left: ${({ $offset }) => ($offset > 0 ? '-4px' : '0')};
  z-index: ${({ $offset }) => 5 - $offset};
  position: relative;
`;

export default FriendItemWithUpdates;
