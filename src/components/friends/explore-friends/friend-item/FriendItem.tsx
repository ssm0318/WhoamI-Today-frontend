import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { StyledFriendItem } from '@components/friends/explore-friends/friend-item/FriendItem.styled';
import { Button, Layout, Typo } from '@design-system';
import {
  areFriends,
  receivedFriendRequest,
  sentFriendRequest,
  User,
  UserProfile,
} from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
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
  user: User | UserProfile;
  onClickConfirm?: () => void;
  onClickDelete?: () => void;
  onClickRequest?: () => void;
}

function FriendItem({ type, user, onClickConfirm, onClickDelete, onClickRequest }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.explore_friends.friend_item' });

  const [isDeleteFriendRequestDialogVisible, setIsDeleteFriendRequestDialogVisible] =
    useState(false);
  const [isBreakFriendDialogVisible, setIsBreakFriendDialogVisible] = useState(false);

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

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
        if (areFriends(user)) {
          setIsBreakFriendDialogVisible(true);
          return;
        }
        setIsDeleteFriendRequestDialogVisible(true);
        return;
      case 'recommended':
        await blockRecommendation(user.id);
        break;
      case 'sent_requests':
        setIsDeleteFriendRequestDialogVisible(true);
        return;
      default:
    }

    onClickDelete?.();
  };

  const handleConfirmDeleteFriendRequestDialog = async () => {
    await cancelFriendRequest(user.id);
    setIsDeleteFriendRequestDialogVisible(false);
    onClickDelete?.();
  };

  const handleConfirmBreakFriendDialog = async () => {
    await breakFriend(user.id);
    setIsBreakFriendDialogVisible(false);
    onClickDelete?.();
  };

  const handleClickRequest = async (e: MouseEvent) => {
    e.stopPropagation();
    await requestFriend({
      userId: user.id,
      onSuccess: () => openToast({ message: t('friend_request_success') }),
      onError: () => openToast({ message: t('temporary_error') }),
    });
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
      {type === 'requests' || receivedFriendRequest(user) ? (
        <Layout.FlexRow gap={8}>
          <Button.Primary status="normal" text={t('confirm')} onClick={handleClickConfirm} />
          <Button.Secondary status="normal" text={t('delete')} onClick={handleClickDelete} />
        </Layout.FlexRow>
      ) : (
        <Layout.FlexRow gap={16} alignItems="center">
          {areFriends(user) ? (
            <Icon name="close" size={16} onClick={handleClickDelete} />
          ) : (
            <>
              {type === 'sent_requests' || sentFriendRequest(user) ? (
                <>
                  <Button.Primary status="completed" text={t('requested')} />
                  <Icon name="close" size={16} onClick={handleClickDelete} />
                </>
              ) : (
                <Button.Primary status="normal" text={t('request')} onClick={handleClickRequest} />
              )}
              {type === 'recommended' && (
                <Icon name="close" size={16} onClick={handleClickDelete} />
              )}
            </>
          )}
        </Layout.FlexRow>
      )}
      {isBreakFriendDialogVisible && (
        <CommonDialog
          visible={isBreakFriendDialogVisible}
          title={t('break_friends_dialog.title')}
          cancelText={t('break_friends_dialog.cancel')}
          confirmText={t('break_friends_dialog.confirm')}
          confirmTextColor="WARNING"
          onClickConfirm={handleConfirmBreakFriendDialog}
          onClickClose={() => setIsBreakFriendDialogVisible(false)}
        />
      )}

      {isDeleteFriendRequestDialogVisible && (
        <CommonDialog
          visible={isDeleteFriendRequestDialogVisible}
          title={t('delete_request_dialog.title')}
          content={t('delete_request_dialog.content', { user: user.username })}
          cancelText={t('delete_request_dialog.cancel')}
          confirmText={t('delete_request_dialog.confirm')}
          confirmTextColor="WARNING"
          onClickConfirm={handleConfirmDeleteFriendRequestDialog}
          onClickClose={() => setIsDeleteFriendRequestDialogVisible(false)}
        />
      )}
    </StyledFriendItem>
  );
}

export default FriendItem;
