import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { StyledFriendItem } from '@components/friends/explore-friends/friend-item/FriendItem.styled';
import Icon from '@components/header/icon/Icon';
import { Button, Layout, Typo } from '@design-system';
import { User } from '@models/user';
import {
  acceptFriendRequest,
  breakFriend,
  rejectFriendRequest,
  requestFriend,
} from '@utils/apis/user';

interface Props {
  type: 'requests' | 'recommended' | 'search';
  user: User;
  updateList?: () => void;
}

// FIXME: 각 버튼 클릭시 동작 정리 필요
function FriendItem({ type, user, updateList }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.explore_friends.friend_item' });

  const handleClickConfirm = async (e: MouseEvent) => {
    e.stopPropagation();
    await acceptFriendRequest(user.id);
    updateList?.();
  };

  const handleClickDelete = async (e: MouseEvent) => {
    e.stopPropagation();

    if (type === 'requests') {
      await rejectFriendRequest(user.id);
      updateList?.();
      return;
    }

    if (type === 'recommended' || type === 'search') {
      await breakFriend(user.id);
      updateList?.();
    }
  };

  const handleClickRequest = async (e: MouseEvent) => {
    e.stopPropagation();

    await requestFriend(user.id);
    updateList?.();
  };

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
      {type === 'requests' && (
        <Layout.FlexRow gap={8}>
          <Button.Primary status="normal" text={t('confirm')} onClick={handleClickConfirm} />
          <Button.Secondary status="normal" text={t('delete')} onClick={handleClickDelete} />
        </Layout.FlexRow>
      )}
      {(type === 'recommended' || type === 'search') && (
        <Layout.FlexRow gap={16} alignItems="center">
          <Button.Primary status="normal" text={t('request')} onClick={handleClickRequest} />
          <Icon name="close" size={16} onClick={handleClickDelete} />
        </Layout.FlexRow>
      )}
    </StyledFriendItem>
  );
}

export default FriendItem;
