import { MouseEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CheckInDetailBottomSheet from '@components/check-in/check-in-detail-bottom-sheet/CheckInDetailBottomSheet';
import PokeButton from '@components/friends/poke-button/PokeButton';
import SubscriptionPopup from '@components/friends/subscription-popup/SubscriptionPopup';
import SwipeablePostCarousel from '@components/friends/swipeable-post-carousel/SwipeablePostCarousel';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import EditConnectionsBottomSheet from '@components/profile/edit-connections/EditConnectionsBottomSheet';
import MoodPlaceholder from '@components/profile/placeholders/MoodPlaceholder';
import MusicPlaceholder from '@components/profile/placeholders/MusicPlaceholder';
import SocialBatteryPlaceholder from '@components/profile/placeholders/SocialBatteryPlaceholder';
import ThoughtPlaceholder from '@components/profile/placeholders/ThoughtPlaceholder';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { FeatureFlagKey } from '@constants/featureFlag';
import { Layout, SvgIcon, Typo } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { Connection, UpdatedProfile } from '@models/api/friends';
import { SocialBattery } from '@models/checkIn';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import {
  AccordionContainer,
  ChevronButton,
  CollapsedRow,
  ExpandableInner,
  ExpandableSection,
  ExpandedContent,
  UpdateBadge,
} from './FriendProfileAccordionItem.styled';

interface Props {
  user: UpdatedProfile;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isMyCard?: boolean;
  onConnectionChanged?: (userId: number, connection: Connection) => void;
  onSubscriptionChanged?: (userId: number, hasSubscription: boolean) => void;
}

function FriendProfileAccordionItem({
  user,
  isExpanded,
  onToggleExpand,
  isMyCard = false,
  onConnectionChanged,
  onSubscriptionChanged,
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
  const trackEvent = useTrackEvent();

  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [isEditConnectionsVisible, setIsEditConnectionsVisible] = useState(false);
  const [checkInDetailFocus, setCheckInDetailFocus] = useState<
    'battery' | 'mood' | 'thought' | 'song' | null
  >(null);

  // --- derived state ---
  const hasCheckInContent = !!(track_id || mood || social_battery || thought);
  const hasUpdate =
    (!user.current_user_read_check_in && hasCheckInContent) ||
    (user.unread_post_cnt ?? 0) > 0 ||
    (user.recent_posts ?? []).some((p) => !p.current_user_read);

  const moodArray: string[] = (Array.isArray(mood) ? mood : mood ? [mood] : []).filter(Boolean);
  const hasMood = moodArray.length > 0;
  const hasThought = !!thought;
  const hasBattery = !!social_battery && Object.values(SocialBattery).includes(social_battery);
  const hasSong = !!track_id;

  const postsToShow = useMemo(() => user.recent_posts ?? [], [user.recent_posts]);

  // --- handlers ---
  const openCheckInDetail = (component: 'battery' | 'mood' | 'thought' | 'song') => {
    if (isMyCard) {
      navigate('/update');
      return;
    }
    trackEvent('friend_check_in_component_opened', {
      component,
      friend_id: id,
      is_close_friend: connection_status === Connection.CLOSE_FRIEND ? 'true' : 'false',
    });
    setCheckInDetailFocus(component);
  };

  const handleClickProfile = (e: MouseEvent) => {
    e.stopPropagation();
    if (isMyCard) {
      navigate('/my');
    } else {
      navigate(`/users/${username}`, { state: { source: 'friends_list' } });
    }
  };

  const handleClickChat = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${id}/chat`);
  };

  const handleClickFriendBadge = (e: MouseEvent) => {
    e.stopPropagation();
    setIsEditConnectionsVisible(true);
  };

  const handleOpenSubscriptionPopup = (e: MouseEvent) => {
    e.stopPropagation();
    setShowSubscriptionPopup(true);
  };

  const handleClickCollapsedRow = () => {
    onToggleExpand();
  };

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();
    onToggleExpand();
  };

  return (
    <AccordionContainer $isMyCard={isMyCard} ph={16} pv={12} gap={0} rounded={12}>
      {/* Collapsed Row: always visible */}
      <CollapsedRow
        gap={6}
        justifyContent="space-between"
        onClick={handleClickCollapsedRow}
        style={{ cursor: 'pointer' }}
      >
        <Layout.FlexRow alignItems="center" gap={6} style={{ flex: 1, minWidth: 0 }}>
          {/* Profile + Username + Connection badge */}
          <Layout.FlexRow
            alignItems="center"
            gap={6}
            onClick={handleClickProfile}
            style={{ cursor: 'pointer', minWidth: 0 }}
          >
            <ProfileImage imageUrl={profile_image} username={username} size={36} />
            <Typo type="label-large" ellipsis={{ enabled: true, maxWidth: 80 }}>
              {username}
            </Typo>
          </Layout.FlexRow>
          {!isMyCard && (
            <SvgIcon
              name={
                connection_status === Connection.CLOSE_FRIEND ? 'close_friend' : 'default_friend'
              }
              size={16}
              onClick={handleClickFriendBadge}
            />
          )}
          {/* Update badge */}
          {!isMyCard && hasUpdate && (
            <UpdateBadge>
              <Typo type="label-medium" color="PRIMARY" fontWeight={700}>
                Update
              </Typo>
            </UpdateBadge>
          )}
        </Layout.FlexRow>

        {/* Right side: bell + chat + chevron */}
        <Layout.FlexRow alignItems="center" gap={12}>
          {!isMyCard && subscriptionPopupEnabled && (
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
                onClose={() => setShowSubscriptionPopup(false)}
                friendId={id}
                username={username}
                currentVersion={myProfile?.current_ver}
                onSubscriptionChange={(hasSub) => onSubscriptionChanged?.(id, hasSub)}
              />
            </>
          )}
          {!isMyCard && (
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
          )}
          <ChevronButton onClick={handleToggle} aria-label={isExpanded ? 'Collapse' : 'Expand'}>
            <SvgIcon name={isExpanded ? 'chevron_up' : 'chevron_down'} size={20} color="BLACK" />
          </ChevronButton>
        </Layout.FlexRow>
      </CollapsedRow>

      {/* Expandable Section */}
      <ExpandableSection $isExpanded={isExpanded}>
        <ExpandableInner>
          <ExpandedContent w="100%" gap={8} pt={8}>
            {/* Check-in section: battery + mood + thought */}
            <Layout.FlexRow gap={4} alignItems="center" style={{ flexWrap: 'wrap' }}>
              {hasBattery ? (
                <SocialBatteryChip
                  socialBattery={social_battery}
                  compact
                  onClick={() => openCheckInDetail('battery')}
                />
              ) : isMyCard ? (
                <SocialBatteryPlaceholder />
              ) : (
                <PokeButton
                  receiverId={id}
                  componentType="battery"
                  initialPokeId={user.sent_pokes?.battery ?? null}
                />
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
              ) : isMyCard ? (
                <MoodPlaceholder />
              ) : (
                <PokeButton
                  receiverId={id}
                  componentType="mood"
                  initialPokeId={user.sent_pokes?.mood ?? null}
                />
              )}
              {hasThought ? (
                <Layout.FlexRow
                  bgColor="WHITE"
                  pv={4}
                  ph={8}
                  gap={4}
                  outline="LIGHT_GRAY"
                  alignItems="center"
                  rounded={8}
                  style={{ flexShrink: 0, cursor: 'pointer' }}
                  onClick={() => openCheckInDetail('thought')}
                >
                  <span style={{ fontSize: 14, lineHeight: 1 }} aria-hidden>
                    🤪
                  </span>
                  <Typo type="label-large" numberOfLines={1}>
                    {thought}
                  </Typo>
                </Layout.FlexRow>
              ) : isMyCard ? (
                <ThoughtPlaceholder />
              ) : (
                <PokeButton
                  receiverId={id}
                  componentType="thought"
                  initialPokeId={user.sent_pokes?.thought ?? null}
                />
              )}
            </Layout.FlexRow>

            {/* Song */}
            {hasSong ? (
              <Layout.FlexRow w="100%" style={{ minWidth: 0, overflow: 'hidden' }}>
                <SpotifyMusic
                  track={track_id}
                  sharer={isMyCard ? undefined : user}
                  fontType="label-large"
                  useAlbumImg
                  onClick={() => openCheckInDetail('song')}
                />
              </Layout.FlexRow>
            ) : isMyCard ? (
              <MusicPlaceholder />
            ) : (
              <PokeButton
                receiverId={id}
                componentType="song"
                initialPokeId={user.sent_pokes?.song ?? null}
              />
            )}

            {/* Recent Posts */}
            {postsToShow.length > 0 && (
              <Layout.FlexCol w="100%" gap={4} mt={4}>
                <Typo type="label-large" color="BLACK" fontWeight={600}>
                  Recent Posts
                </Typo>
                <SwipeablePostCarousel posts={postsToShow} isMyPage={isMyCard} />
              </Layout.FlexCol>
            )}
          </ExpandedContent>
        </ExpandableInner>
      </ExpandableSection>

      {/* Bottom sheets / popups */}
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

      {!isMyCard && (
        <EditConnectionsBottomSheet
          user={user as unknown as UserProfile}
          visible={isEditConnectionsVisible}
          closeBottomSheet={() => setIsEditConnectionsVisible(false)}
          onConnectionChanged={(connection) => onConnectionChanged?.(user.id, connection)}
        />
      )}
    </AccordionContainer>
  );
}

const StackedEmoji = styled.span<{ $offset: number }>`
  font-size: 16px;
  line-height: 1;
  margin-left: ${({ $offset }) => ($offset > 0 ? '-4px' : '0')};
  z-index: ${({ $offset }) => 5 - $offset};
  position: relative;
`;

export default FriendProfileAccordionItem;
