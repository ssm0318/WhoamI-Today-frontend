import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import { Button, Layout } from '@design-system';
import { Connection } from '@models/api/friends';
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
import FriendTypeSelectModal from '../friend-type-select-modal/FriendTypeSelectModal';

export interface Props {
  type: 'sent_requests' | 'requests' | 'recommended' | 'search' | 'user';
  user: User | UserProfile;
  isUserPage?: boolean;
  /** 친구 요청 수락 */
  onClickConfirm?: () => void;
  /** 친구 요청 거절 */
  onClickReject?: () => void;
  /** 친구 삭제 */
  onClickUnfriend?: () => void;
  /** 친구 추천 삭제 */
  onClickDeleteRecommendation?: () => void;
  /** 친구 요청 */
  onClickRequest?: () => void;
  /** 친구 요청 취소 */
  onClickCancelRequest?: () => void;
}

function FriendStatus({
  type,
  user,
  isUserPage,
  onClickConfirm,
  onClickReject,
  onClickUnfriend,
  onClickDeleteRecommendation,
  onClickRequest,
  onClickCancelRequest,
}: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.explore_friends.friend_item' });

  const [isCancelFriendRequestDialogVisible, setIsCancelFriendRequestDialogVisible] =
    useState(false);
  const [isRejectFriendRequestDialogVisible, setIsRejectFriendRequestDialogVisible] =
    useState(false);
  const [isUnfriendDialogVisible, setIsUnfriendDialogVisible] = useState(false);
  const [isFriendTypeSelectModalVisible, setIsFriendTypeSelectModalVisible] = useState<{
    visible: boolean;
    type: 'accept' | 'request';
  } | null>(null);

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const handleConfirmAcceptFriendRequest = async ({
    friendType,
    updatePastPosts,
  }: {
    friendType: Connection;
    updatePastPosts?: boolean;
  }) => {
    await acceptFriendRequest({
      userId: user.id,
      friendType,
      updatePastPosts,
      onSuccess: () => openToast({ message: t('friend_accept_success') }),
      onError: () => openToast({ message: t('temporary_error') }),
    });
    onClickConfirm?.();
  };

  const handleClickConfirm = (e: MouseEvent) => {
    e.stopPropagation();
    setIsFriendTypeSelectModalVisible({ visible: true, type: 'accept' });
  };

  const handleClickRejectFriendRequest = (e: MouseEvent) => {
    e.stopPropagation();
    setIsRejectFriendRequestDialogVisible(true);
  };

  const handleClickUnfriend = (e: MouseEvent) => {
    e.stopPropagation();
    setIsUnfriendDialogVisible(true);
  };

  const handleClickCancelRequest = (e: MouseEvent) => {
    e.stopPropagation();
    setIsCancelFriendRequestDialogVisible(true);
  };

  const handleClickDeleteRecommendation = async (e: MouseEvent) => {
    e.stopPropagation();
    await blockRecommendation(user.id);
    onClickDeleteRecommendation?.();
  };

  const handleConfirmCancelFriendRequestDialog = async () => {
    await cancelFriendRequest(user.id);
    setIsCancelFriendRequestDialogVisible(false);
    onClickCancelRequest?.();
  };

  const handleConfirmRejectFriendRequestDialog = async () => {
    await rejectFriendRequest({
      userId: user.id,
      onSuccess: () => openToast({ message: t('friend_reject_success') }),
      onError: () => openToast({ message: t('temporary_error') }),
    });
    setIsRejectFriendRequestDialogVisible(false);
    onClickReject?.();
  };

  const handleConfirmUnfriendDialog = async () => {
    await breakFriend(user.id);
    setIsUnfriendDialogVisible(false);
    onClickUnfriend?.();
  };

  const handleConfirmRequestFriend = async ({
    friendType,
    updatePastPosts,
  }: {
    friendType: Connection;
    updatePastPosts?: boolean;
  }) => {
    await requestFriend({
      userId: user.id,
      friendRequestType: friendType,
      updatePastPosts,
      onSuccess: () => {
        openToast({ message: t('friend_request_success') });
        onClickRequest?.();
      },
      onError: (errorMsg: string) => openToast({ message: errorMsg }),
    });
  };

  const handleClickRequest = (e: MouseEvent) => {
    e.stopPropagation();
    setIsFriendTypeSelectModalVisible({ visible: true, type: 'request' });
  };

  const PrimaryButton = isUserPage ? Button.Highlight : Button.Primary;

  return (
    <>
      <Layout.FlexRow gap={8} w="100%">
        {areFriends(user) ? (
          <Button.Secondary
            status="normal"
            text={t('unfriend')}
            sizing="stretch"
            onClick={handleClickUnfriend}
          />
        ) : type === 'requests' || receivedFriendRequest(user) ? (
          <>
            <PrimaryButton
              status="normal"
              text={t('confirm')}
              sizing="stretch"
              onClick={handleClickConfirm}
            />
            <Button.Secondary
              status="normal"
              text={t('reject')}
              sizing="stretch"
              onClick={handleClickRejectFriendRequest}
            />
          </>
        ) : (
          <>
            {type === 'sent_requests' || sentFriendRequest(user) ? (
              <>
                <PrimaryButton status="completed" text={t('requested')} sizing="stretch" />
                <Button.Secondary
                  status="normal"
                  text={t('cancel')}
                  sizing="stretch"
                  onClick={handleClickCancelRequest}
                />
              </>
            ) : (
              <PrimaryButton
                status="normal"
                text={t('request')}
                sizing="stretch"
                onClick={handleClickRequest}
              />
            )}
            {type === 'recommended' && (
              <Button.Secondary
                status="normal"
                text={t('block_recommendation')}
                sizing="stretch"
                onClick={handleClickDeleteRecommendation}
              />
            )}
          </>
        )}
      </Layout.FlexRow>
      {isCancelFriendRequestDialogVisible && (
        <CommonDialog
          visible={isCancelFriendRequestDialogVisible}
          title={t('delete_request_dialog.title')}
          content={t('delete_request_dialog.content', { user: user.username })}
          cancelText={t('delete_request_dialog.cancel')}
          confirmText={t('delete_request_dialog.confirm')}
          confirmTextColor="WARNING"
          onClickConfirm={handleConfirmCancelFriendRequestDialog}
          onClickClose={() => setIsCancelFriendRequestDialogVisible(false)}
        />
      )}
      {isRejectFriendRequestDialogVisible && (
        <CommonDialog
          visible={isRejectFriendRequestDialogVisible}
          title={t('reject_request_dialog.title')}
          content={t('reject_request_dialog.content', { user: user.username })}
          cancelText={t('reject_request_dialog.cancel')}
          confirmText={t('reject_request_dialog.confirm')}
          confirmTextColor="WARNING"
          onClickConfirm={handleConfirmRejectFriendRequestDialog}
          onClickClose={() => setIsRejectFriendRequestDialogVisible(false)}
        />
      )}
      {isUnfriendDialogVisible && (
        <CommonDialog
          visible={isUnfriendDialogVisible}
          title={t('break_friends_dialog.title')}
          cancelText={t('break_friends_dialog.cancel')}
          confirmText={t('break_friends_dialog.confirm')}
          confirmTextColor="WARNING"
          onClickConfirm={handleConfirmUnfriendDialog}
          onClickClose={() => setIsUnfriendDialogVisible(false)}
        />
      )}
      {!!isFriendTypeSelectModalVisible && (
        <FriendTypeSelectModal
          visible={isFriendTypeSelectModalVisible.visible}
          onClickConfirm={
            isFriendTypeSelectModalVisible.type === 'accept'
              ? handleConfirmAcceptFriendRequest
              : handleConfirmRequestFriend
          }
          onClickClose={() => setIsFriendTypeSelectModalVisible(null)}
          type={isFriendTypeSelectModalVisible.type}
        />
      )}
    </>
  );
}

export default FriendStatus;
