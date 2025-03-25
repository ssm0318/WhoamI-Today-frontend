import { useNavigate } from 'react-router-dom';
import FriendStatus, { Props } from '@components/_common/friend-status/FriendStatus';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { StyledFriendItem } from '@components/friends/explore-friends/friend-item/FriendItem.styled';
import { Layout, Typo } from '@design-system';

interface FriendItemProps extends Props {
  showEmail?: boolean;
}

function FriendItem(props: FriendItemProps) {
  const { user, showEmail = false } = props;
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
        <Layout.FlexCol>
          <Typo type="label-large" ellipsis={{ enabled: true, maxWidth: 160 }}>
            {user.username}
          </Typo>
          {showEmail && (
            <Typo
              type="label-medium"
              color="MEDIUM_GRAY"
              ellipsis={{ enabled: true, maxWidth: 300 }}
            >
              {user.email}
            </Typo>
          )}
        </Layout.FlexCol>
      </Layout.FlexRow>
      <Layout.LayoutBase>
        <FriendStatus {...props} />
      </Layout.LayoutBase>
    </StyledFriendItem>
  );
}

export default FriendItem;
