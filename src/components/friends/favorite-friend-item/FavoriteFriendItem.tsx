import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import { Layout, Typo } from '@design-system';
import { Connection, UpdatedProfile } from '@models/api/friends';

interface Props {
  user: UpdatedProfile;
}

function FavoriteFriendItem({ user }: Props) {
  const {
    profile_image,
    id: userId,
    username,
    current_user_read,
    track_id,
    description,
    connection_status,
  } = user;

  const [t] = useTranslation('translation', { keyPrefix: 'friend' });

  const navigate = useNavigate();
  const handleClickProfile = () => {
    navigate(`/users/${username}`);
  };

  const handleClickPing = () => {
    navigate(`/users/${userId}/ping`);
  };

  return (
    <Layout.FlexCol alignItems="center" gap={6} style={{ width: 140 }}>
      <Layout.FlexRow style={{ position: 'relative' }}>
        <button type="button" onClick={handleClickProfile}>
          <ProfileImage
            imageUrl={profile_image}
            username={username}
            size={72}
            updated={!current_user_read}
            updatedLabelSize={11}
          />
          <Layout.Absolute
            justifyContent="center"
            alignItems="center"
            b={-3}
            alignSelf="center"
            w="100%"
          >
            <Layout.FlexRow
              bgColor="SECONDARY"
              rounded={4}
              gap={5}
              ph={4}
              pv={2}
              alignItems="center"
              justifyContent="center"
            >
              <Typo type="label-small" color="BLACK">
                {connection_status === Connection.FRIEND ? t('friend') : t('close_friend')}
              </Typo>
            </Layout.FlexRow>
          </Layout.Absolute>
        </button>
      </Layout.FlexRow>
      <Layout.FlexRow gap={5} justifyContent="center" alignItems="center">
        <Typo type="label-large" color="DARK" ellipsis={{ enabled: true, maxWidth: 120 }}>
          {username}
        </Typo>
        <Layout.LayoutBase pb={2}>
          <Icon name="ping_send" size={20} onClick={handleClickPing} />
        </Layout.LayoutBase>
      </Layout.FlexRow>
      <Layout.FlexRow gap={3} alignItems="center">
        {track_id && <SpotifyMusic track={track_id} sharer={user} useDetailBottomSheet />}
      </Layout.FlexRow>
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
