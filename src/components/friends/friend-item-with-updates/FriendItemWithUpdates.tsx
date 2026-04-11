import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CheckInDetailBottomSheet from '@components/check-in/check-in-detail-bottom-sheet/CheckInDetailBottomSheet';
import PokeButton from '@components/friends/poke-button/PokeButton';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import EditConnectionsBottomSheet from '@components/profile/edit-connections/EditConnectionsBottomSheet';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { FeatureFlagKey } from '@constants/featureFlag';
import { Layout, SvgIcon, Typo } from '@design-system';
import { Connection, UpdatedProfile } from '@models/api/friends';
import { SocialBattery } from '@models/checkIn';
import { RecentPost } from '@models/post';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { Container } from './FriendItemWithUpdates.styled';

interface Props {
  user: UpdatedProfile;
  recentPost?: RecentPost;
  onConnectionChanged?: (userId: number, connection: Connection) => void;
}

function FriendItemWithUpdates({ user, recentPost, onConnectionChanged }: Props) {
  const {
    id,
    profile_image,
    username,
    unread_ping_count,
    track_id,
    mood,
    social_battery,
    connection_status,
  } = user;
  const thought = (user as any).thought ?? (user as any).description ?? '';

  const navigate = useNavigate();
  const { featureFlags } = useBoundStore(UserSelector);

  const [isEditConnectionsBottomSheetVisible, setIsEditConnectionsBottomSheetVisible] =
    useState(false);
  const [checkInDetailFocus, setCheckInDetailFocus] = useState<
    'battery' | 'mood' | 'thought' | 'song' | null
  >(null);

  const handleClickProfile = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${username}`);
  };

  const handleClickPing = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${id}/ping`);
  };

  const handleClickFriendBadge = (e: MouseEvent) => {
    e.stopPropagation();
    if (featureFlags?.[FeatureFlagKey.FRIEND_REQUEST_TYPE]) {
      setIsEditConnectionsBottomSheetVisible(true);
    }
  };

  const handleClickNewPost = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/friends/${username}/new-posts`);
  };

  const hasNewPost = (!!recentPost && !recentPost.is_read) || (user as any).unread_post_cnt > 0;

  // Normalize mood to array
  const moodArray: string[] = Array.isArray(mood) ? mood : mood ? [mood] : [];
  const hasMood = moodArray.length > 0;
  const hasThought = !!thought;
  const hasBattery = !!social_battery && Object.values(SocialBattery).includes(social_battery);
  const hasSong = !!track_id;

  return (
    <Container mh={16} ph={16} pv={12} gap={12} rounded={12}>
      {/* Row 1: Profile + username + badge + battery(emoji or nudge) + new post + ping */}
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
          {hasBattery ? (
            <SocialBatteryChip
              socialBattery={social_battery}
              compact
              borderless
              onClick={() => setCheckInDetailFocus('battery')}
            />
          ) : (
            <PokeButton receiverId={id} componentType="battery" />
          )}
          {hasNewPost && (
            <Layout.FlexRow
              pv={4}
              ph={8}
              rounded={8}
              onClick={handleClickNewPost}
              style={{ backgroundColor: '#EEE6F4', flexShrink: 0, cursor: 'pointer' }}
            >
              <Typo type="label-large" color="PRIMARY" fontWeight={600}>
                New post
              </Typo>
            </Layout.FlexRow>
          )}
        </Layout.FlexRow>
        <Layout.FlexRow style={{ position: 'relative' }}>
          <Layout.LayoutBase pb={2}>
            <Icon name="friend_item_chat" color="BLACK" size={20} onClick={handleClickPing} />
          </Layout.LayoutBase>
          {unread_ping_count > 0 && (
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
                {unread_ping_count > 99 ? '99+' : unread_ping_count}
              </Typo>
            </Layout.Absolute>
          )}
        </Layout.FlexRow>
      </Layout.FlexRow>

      {/* Mood pill (separate from thought) */}
      {hasMood ? (
        <Layout.FlexRow
          bgColor="WHITE"
          gap={2}
          pv={4}
          ph={8}
          outline="LIGHT_GRAY"
          alignItems="center"
          rounded={8}
          style={{ flexShrink: 0, cursor: 'pointer', alignSelf: 'flex-start' }}
          onClick={() => setCheckInDetailFocus('mood')}
        >
          {moodArray.map((emoji) => (
            <span key={emoji} style={{ fontSize: 16, lineHeight: 1 }}>
              {emoji}
            </span>
          ))}
        </Layout.FlexRow>
      ) : (
        <PokeButton receiverId={id} componentType="mood" />
      )}

      {/* Thought pill (separate from mood) */}
      {hasThought ? (
        <Layout.FlexRow
          bgColor="WHITE"
          pv={4}
          ph={8}
          outline="LIGHT_GRAY"
          alignItems="center"
          rounded={8}
          style={{ flexShrink: 0, cursor: 'pointer', alignSelf: 'flex-start' }}
          onClick={() => setCheckInDetailFocus('thought')}
        >
          <Typo type="label-large" numberOfLines={1}>
            {thought}
          </Typo>
        </Layout.FlexRow>
      ) : (
        <PokeButton receiverId={id} componentType="thought" />
      )}

      {/* Song */}
      {hasSong ? (
        <Layout.FlexRow w="100%" style={{ minWidth: 0, overflow: 'hidden' }}>
          <SpotifyMusic
            track={track_id}
            sharer={user}
            fontType="label-large"
            useAlbumImg
            useDetailBottomSheet
          />
        </Layout.FlexRow>
      ) : (
        <PokeButton receiverId={id} componentType="song" />
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

export default FriendItemWithUpdates;
