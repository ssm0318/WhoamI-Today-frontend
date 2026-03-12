import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CheckInDetailBottomSheet from '@components/check-in/check-in-detail-bottom-sheet/CheckInDetailBottomSheet';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import EditConnectionsBottomSheet from '@components/profile/edit-connections/EditConnectionsBottomSheet';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { FeatureFlagKey } from '@constants/featureFlag';
import { Layout, SvgIcon, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import SpotifyManager from '@libs/SpotifyManager';
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
    description,
    social_battery,
    connection_status,
  } = user;

  const navigate = useNavigate();
  const postMessage = usePostAppMessage();
  const { featureFlags } = useBoundStore(UserSelector);

  const [isEditConnectionsBottomSheetVisible, setIsEditConnectionsBottomSheetVisible] =
    useState(false);
  const [isCheckInDetailVisible, setIsCheckInDetailVisible] = useState(false);

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

  const handleClickMusic = () => {
    if (!track_id) return;
    const spotifyManager = SpotifyManager.getInstance();
    spotifyManager
      .getTrack(track_id)
      .then((trackData) => {
        const url = trackData.external_urls.spotify;
        if (window.ReactNativeWebView) {
          postMessage('OPEN_BROWSER', { url });
        } else {
          window.open(url, '_blank');
        }
      })
      .catch(() => {});
  };

  const handleClickCheckInChip = () => {
    setIsCheckInDetailVisible(true);
  };

  const hasNewPost = !!recentPost && !recentPost.is_read;

  return (
    <Container mh={16} ph={16} pv={12} gap={12} rounded={12}>
      {/* Profile header */}
      <Layout.FlexRow w="100%" gap={4} alignItems="center" justifyContent="space-between">
        <Layout.FlexRow
          alignItems="center"
          gap={7}
          onClick={handleClickProfile}
          style={{ cursor: 'pointer' }}
        >
          <ProfileImage imageUrl={profile_image} username={username} size={36} />
          <Layout.FlexRow alignItems="center" gap={4}>
            <Typo type="label-large" ellipsis={{ enabled: true, maxWidth: 100 }} mr={4}>
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

      {/* Check-in chips */}
      <Layout.FlexCol gap={4} w="100%">
        <Layout.FlexRow gap={4} w="100%" style={{ minHeight: track_id ? 28 : undefined }}>
          {social_battery && Object.values(SocialBattery).includes(social_battery) && (
            <SocialBatteryChip socialBattery={social_battery} onClick={handleClickCheckInChip} />
          )}
          {track_id && (
            <Layout.FlexRow style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <SpotifyMusic
                track={track_id}
                fontType="label-large"
                useAlbumImg
                onClick={handleClickMusic}
              />
            </Layout.FlexRow>
          )}
        </Layout.FlexRow>
        <Layout.FlexRow style={{ flexWrap: 'wrap' }} gap={4}>
          {description && (
            <Layout.FlexRow
              bgColor="WHITE"
              gap={4}
              pv={4}
              ph={8}
              outline="LIGHT_GRAY"
              alignItems="center"
              rounded={999}
              style={{ flexShrink: 0, cursor: 'pointer' }}
              onClick={handleClickCheckInChip}
            >
              <Typo type="label-large">{description}</Typo>
            </Layout.FlexRow>
          )}
          {hasNewPost && (
            <Layout.FlexRow
              gap={4}
              pv={4}
              ph={8}
              alignItems="center"
              rounded={999}
              style={{ backgroundColor: '#EEE6F4', flexShrink: 0 }}
            >
              <Typo type="label-large" color="PRIMARY" fontWeight={600}>
                New post
              </Typo>
            </Layout.FlexRow>
          )}
        </Layout.FlexRow>
      </Layout.FlexCol>

      {/* Check-in detail bottom sheet */}
      <CheckInDetailBottomSheet
        visible={isCheckInDetailVisible}
        closeBottomSheet={() => setIsCheckInDetailVisible(false)}
        username={username}
        profileImage={profile_image}
        socialBattery={social_battery}
        trackId={track_id}
        description={description}
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
