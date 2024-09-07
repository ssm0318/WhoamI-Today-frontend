import { useNavigate } from 'react-router-dom';
import FriendStatus from '@components/_common/friend-status/FriendStatus';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { StyledFriendItem } from '@components/friends/explore-friends/friend-item/FriendItem.styled';
import { Layout, Typo } from '@design-system';
import { User, UserProfile } from '@models/user';

interface Props {
  type: 'sent_requests' | 'requests' | 'recommended' | 'search';
  user: User | UserProfile;
  /** 친구 요청 수락 */
  onClickConfirm?: () => void;
  /** 친구 요청 거절, 친구 삭제, 친구 추천 삭제 */
  onClickDelete?: () => void;
  /** 친구 요청 */
  onClickRequest?: () => void;
  /** 친구 요청 취소 */
  onClickCancel?: () => void;
}

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
        <Typo type="label-large">{user.username}</Typo>
      </Layout.FlexRow>
      <Layout.LayoutBase>
        <FriendStatus {...props} />
      </Layout.LayoutBase>
    </StyledFriendItem>
  );
}

export default FriendItem;
