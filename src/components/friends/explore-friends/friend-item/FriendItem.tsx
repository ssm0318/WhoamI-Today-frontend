import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { StyledFriendItem } from '@components/friends/explore-friends/friend-item/FriendItem.styled';
import { Button, Layout, Typo } from '@design-system';
import { User } from '@models/user';
import {
  acceptFriendRequest,
  blockRecommendation,
  breakFriend,
  cancelFriendRequest,
  rejectFriendRequest,
  requestFriend,
} from '@utils/apis/user';

interface Props {
  type: 'sent_requests' | 'requests' | 'recommended' | 'search';
  user: User;
  disableRequest?: boolean;
  onClickConfirm?: () => void;
  onClickDelete?: () => void;
  onClickRequest?: () => void;
}

function FriendItem({
  type,
  user,
  disableRequest,
  onClickConfirm,
  onClickDelete,
  onClickRequest,
}: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.explore_friends.friend_item' });

  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const handleClickConfirm = async (e: MouseEvent) => {
    e.stopPropagation();
    await acceptFriendRequest(user.id);
    onClickConfirm?.();
  };

  const handleClickDelete = async (e: MouseEvent) => {
    e.stopPropagation();

    switch (type) {
      case 'requests':
        await rejectFriendRequest(user.id);
        break;
      case 'search':
        await breakFriend(user.id);
        break;
      case 'recommended':
        await blockRecommendation(user.id);
        break;
      case 'sent_requests':
        setIsDeleteDialogVisible(true);
        return;
      default:
    }

    onClickDelete?.();
  };

  const handleClickDeleteDialogConfirm = async () => {
    await cancelFriendRequest(user.id);
    setIsDeleteDialogVisible(false);
    onClickDelete?.();
  };

  const handleClickRequest = async (e: MouseEvent) => {
    e.stopPropagation();
    await requestFriend(user.id);
    onClickRequest?.();
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
      {(type === 'recommended' || type === 'search' || type === 'sent_requests') && (
        <Layout.FlexRow gap={16} alignItems="center">
          <Button.Primary
            status={
              disableRequest ? (type === 'sent_requests' ? 'completed' : 'disabled') : 'normal'
            }
            text={type === 'sent_requests' ? t('requested') : t('request')}
            onClick={handleClickRequest}
          />
          <Icon name="close" size={16} onClick={handleClickDelete} />
        </Layout.FlexRow>
      )}
      {type === 'sent_requests' && isDeleteDialogVisible && (
        <CommonDialog
          visible={isDeleteDialogVisible}
          title={t('delete_request_dialog.title')}
          content={t('delete_request_dialog.content', { user: user.username })}
          cancelText={t('delete_request_dialog.cancel')}
          confirmText={t('delete_request_dialog.confirm')}
          confirmTextColor="WARNING"
          onClickConfirm={handleClickDeleteDialogConfirm}
          onClickClose={() => setIsDeleteDialogVisible(false)}
        />
      )}
    </StyledFriendItem>
  );
}

export default FriendItem;
