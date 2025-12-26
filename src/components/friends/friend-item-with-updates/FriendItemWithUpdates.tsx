import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import RecentPost from '@components/_common/recent-post/RecentPost';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { Layout, SvgIcon, Typo } from '@design-system';
import { Connection, UpdatedProfile } from '@models/api/friends';
import { Note } from '@models/post';
import { Container } from './FriendItemWithUpdates.styled';

interface Props {
  user: UpdatedProfile;
  recentPost?: Note;
}

function FriendItemWithUpdates({ user, recentPost }: Props) {
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

  const handleClickProfile = () => {
    navigate(`/users/${username}`);
  };

  const handleClickPing = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${id}/ping`);
  };

  const handleClickFriendBadge = () => {
    // TODO: 친한 친구 토글 (CLOSE FRIEND <-> FRIEND)
    console.log('handleClickFriendBadge');
  };

  return (
    <Container mh={16} ph={16} pv={12} gap={12} onClick={handleClickProfile} rounded={12}>
      {/* 프로필 헤더 */}
      <Layout.FlexRow w="100%" gap={4} alignItems="center" justifyContent="space-between">
        <Layout.FlexRow alignItems="center" gap={7}>
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

      {/* Status/Mood Chips */}
      <Layout.FlexCol gap={4}>
        <Layout.FlexRow gap={4} style={{ minHeight: track_id ? 28 : undefined }}>
          {social_battery && <SocialBatteryChip socialBattery={social_battery} />}
          {track_id && (
            <SpotifyMusic
              track={track_id}
              useDetailBottomSheet
              fontType="label-large"
              useAlbumImg
            />
          )}
        </Layout.FlexRow>
        <Layout.FlexRow style={{ flexWrap: 'wrap' }}>
          {description && (
            <Layout.FlexRow
              bgColor="WHITE"
              gap={4}
              pv={4}
              ph={8}
              outline="LIGHT_GRAY"
              alignItems="center"
              rounded={12}
              style={{ flexShrink: 0 }}
            >
              <Typo type="label-large">{description}</Typo>
            </Layout.FlexRow>
          )}
        </Layout.FlexRow>
      </Layout.FlexCol>

      {/* Recent Post 영역 (유저마다 무조건 하나씩은 있음) */}
      {recentPost && <RecentPost recentPost={recentPost} hideContent />}
    </Container>
  );
}

export default FriendItemWithUpdates;
