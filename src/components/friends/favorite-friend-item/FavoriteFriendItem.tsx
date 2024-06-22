import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import { UpdatedProfile } from '@models/api/friends';
import { getChatRoomIdByUserId } from '@utils/apis/chat';
import SpotifyMusic from '../spotify-music/SpotifyMusic';
import UpdatedLabel from '../updated-label/UpdatedLabel';

interface Props {
  user: UpdatedProfile;
}

function FavoriteFriendItem({ user }: Props) {
  // NOTE: api 필드 수정전 임시 값
  const bio = 'bio bio bio!! bio bio bio!! bio bio bio!! bio bio bio!!';
  const track_id = '24DefNCFiWTP8OjYWiXuYe';
  const { id, profile_image, username, current_user_read } = user;

  const navigate = useNavigate();
  const handleClickProfile = () => {
    navigate(`/users/${username}`);
  };

  const handleClickChat = async (e: MouseEvent) => {
    e.stopPropagation();

    const roomId = await getChatRoomIdByUserId(id);
    if (!roomId) return;
    navigate(`/chats/${roomId}`);
  };

  return (
    <Layout.FlexCol alignItems="center" gap={12} style={{ width: '113px' }}>
      <Layout.FlexRow style={{ position: 'relative' }}>
        <button type="button" onClick={handleClickProfile}>
          <ProfileImage imageUrl={profile_image} username={username} size={83} />
        </button>
        <Layout.Absolute rounded={100} bgColor="PRIMARY" p={10} t={-8} r={-19}>
          <Icon name="friend_updates_chat" size={28} onClick={handleClickChat} fill="WHITE" />
        </Layout.Absolute>
      </Layout.FlexRow>
      <Layout.FlexRow gap={5} justifyContent="center" alignItems="center">
        <Typo type="label-large" color="DARK">
          {username}
        </Typo>
        {!current_user_read && <UpdatedLabel />}
      </Layout.FlexRow>
      {track_id && <SpotifyMusic track_id={track_id} sharer={user} />}
      {bio && (
        <Layout.FlexRow
          pv={4}
          ph={8}
          justifyContent="center"
          alignItems="center"
          rounded={12}
          outline="LIGHT_GRAY"
        >
          <Typo type="label-medium" color="DARK_GRAY">
            {bio}
          </Typo>
        </Layout.FlexRow>
      )}
    </Layout.FlexCol>
  );
}

export default FavoriteFriendItem;
