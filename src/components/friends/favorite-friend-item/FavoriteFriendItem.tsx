import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import { Layout, Typo } from '@design-system';
import { UpdatedProfile } from '@models/api/friends';
import UpdatedLabel from '../updated-label/UpdatedLabel';

interface Props {
  user: UpdatedProfile;
}

function FavoriteFriendItem({ user }: Props) {
  const { profile_image, username, current_user_read, track_id, description } = user;

  const navigate = useNavigate();
  const handleClickProfile = () => {
    navigate(`/users/${username}`);
  };

  const handleClickPing = () => {
    navigate(`/users/${username}/ping`);
  };

  return (
    <Layout.FlexCol alignItems="center" gap={12} style={{ width: '113px' }}>
      <Layout.FlexRow style={{ position: 'relative' }}>
        <button type="button" onClick={handleClickProfile}>
          <ProfileImage imageUrl={profile_image} username={username} size={83} />
        </button>
        <Layout.Absolute rounded={100} bgColor="PRIMARY" p={10} t={-8} r={-19}>
          <Icon name="favorite_ping" size={28} onClick={handleClickPing} fill="WHITE" />
        </Layout.Absolute>
      </Layout.FlexRow>
      <Layout.FlexRow gap={5} justifyContent="center" alignItems="center">
        <Typo type="label-large" color="DARK" ellipsis={{ enabled: true, maxWidth: 120 }}>
          {username}
        </Typo>
        {!current_user_read && <UpdatedLabel />}
      </Layout.FlexRow>
      {track_id && <SpotifyMusic track={track_id} sharer={user} useDetailBottomSheet />}
      {description && (
        <Layout.FlexRow
          pv={4}
          ph={8}
          justifyContent="center"
          alignItems="center"
          rounded={12}
          outline="LIGHT_GRAY"
        >
          <Typo type="label-medium" color="DARK_GRAY">
            {description}
          </Typo>
        </Layout.FlexRow>
      )}
    </Layout.FlexCol>
  );
}

export default FavoriteFriendItem;
