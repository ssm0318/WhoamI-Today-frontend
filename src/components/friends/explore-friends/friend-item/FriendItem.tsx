import { useNavigate } from 'react-router-dom';
import FriendStatus, { Props } from '@components/_common/friend-status/FriendStatus';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { StyledFriendItem } from '@components/friends/explore-friends/friend-item/FriendItem.styled';
import { Layout, Typo } from '@design-system';

function FriendItem(props: Props) {
  const { user } = props;
  const navigate = useNavigate();

  const handleClickItem = () => {
    navigate(`/users/${user.username}`);
  };

  return (
    <StyledFriendItem
      w="100%"
      key={user.id}
      justifyContent="space-between"
      alignItems="center"
      pv={4}
      onClick={handleClickItem}
    >
      <Layout.FlexRow alignItems="center" gap={7}>
        <ProfileImage imageUrl={user.profile_image} username={user.username} size={44} />
        <Typo type="label-large" ellipsis={{ enabled: true, maxWidth: 160 }}>
          {user.username}
        </Typo>
      </Layout.FlexRow>
      <Layout.LayoutBase>
        <FriendStatus {...props} />
      </Layout.LayoutBase>
    </StyledFriendItem>
  );
}

export default FriendItem;
