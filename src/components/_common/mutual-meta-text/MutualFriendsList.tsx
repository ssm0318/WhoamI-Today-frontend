import { useNavigate } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import { User } from '@models/user';

interface MutualFriendsListProps {
  users: User[];
  isLoading: boolean;
  emptyText: string;
  onItemClick: () => void;
}

function MutualFriendsList({ users, isLoading, emptyText, onItemClick }: MutualFriendsListProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Layout.FlexCol w="100%" alignItems="center" pv={16}>
        <Loader />
      </Layout.FlexCol>
    );
  }

  if (users.length === 0) {
    return (
      <Layout.FlexCol w="100%" alignItems="center" pv={16}>
        <Typo type="label-medium" color="MEDIUM_GRAY">
          {emptyText}
        </Typo>
      </Layout.FlexCol>
    );
  }

  const handleClickRow = (username: string) => {
    onItemClick();
    navigate(`/users/${username}`);
  };

  return (
    <Layout.FlexCol w="100%">
      {users.map((user) => (
        <Layout.FlexRow
          key={user.id}
          w="100%"
          alignItems="center"
          gap={8}
          pv={6}
          onClick={() => handleClickRow(user.username)}
        >
          <ProfileImage imageUrl={user.profile_image} username={user.username} size={40} />
          <Typo type="label-large" ellipsis={{ enabled: true, maxWidth: 240 }}>
            {user.username}
          </Typo>
        </Layout.FlexRow>
      ))}
    </Layout.FlexCol>
  );
}

export default MutualFriendsList;
