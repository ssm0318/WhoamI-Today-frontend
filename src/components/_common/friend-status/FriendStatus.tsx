import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import FriendEvaluationModal, {
  EvaluationData,
} from '@components/_common/friend-evaluation-modal/FriendEvaluationModal';
import { useIsPreviewMode } from '@components/view-as/PreviewModeContext';
import { Button, Layout } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
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
  EvaluationParams,
  rejectFriendRequest,
  requestFriend,
} from '@utils/apis/user';
import FriendTypeSelectModal from '../friend-type-select-modal/FriendTypeSelectModal';

const CompactButtonRow = styled(Layout.FlexRow)`
  .button_component {
    padding: 8px 16px;
    min-height: 36px;
    white-space: nowrap;
  }
`;

const RequestedButton = styled(Button.Highlight)`
  && > button > .button_component {
    background-color: ${({ theme }) => theme.MEDIUM_GRAY};
  }
`;

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
  const navigate = useNavigate();
  const previewMode = useIsPreviewMode();

  const [isCancelFriendRequestDialogVisible, setIsCancelFriendRequestDialogVisible] =
    useState(false);
  const [isVisitProfileDialogVisible, setIsVisitProfileDialogVisible] = useState(false);
  const [isReplyDialogVisible, setIsReplyDialogVisible] = useState(false);
  const [isRejectFriendRequestDialogVisible, setIsRejectFriendRequestDialogVisible] =
    useState(false);
  const [isUnfriendDialogVisible, setIsUnfriendDialogVisible] = useState(false);
  const [isFriendTypeSelectModalVisible, setIsFriendTypeSelectModalVisible] = useState<{
    visible: boolean;
    type: 'accept' | 'request';
  } | null>(null);

  // Evaluation modal state: stores friendType selection from FriendTypeSelectModal
  const [evaluationModalState, setEvaluationModalState] = useState<{
    visible: boolean;
    type: 'request' | 'accept';
    friendType: Connection;
    updatePastPosts?: boolean;
  } | null>(null);

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  // FriendTypeSelectModal confirm → save friendType, open evaluation modal
  const handleFriendTypeConfirmForAccept = ({
    friendType,
    updatePastPosts,
  }: {
    friendType: Connection;
    updatePastPosts?: boolean;
  }) => {
    setEvaluationModalState({
      visible: true,
      type: 'accept',
      friendType,
      updatePastPosts,
    });
  };

  const handleFriendTypeConfirmForRequest = ({
    friendType,
    updatePastPosts,
  }: {
    friendType: Connection;
    updatePastPosts?: boolean;
  }) => {
    setEvaluationModalState({
      visible: true,
      type: 'request',
      friendType,
      updatePastPosts,
    });
  };

  // Evaluation modal submit → call API with evaluation data
  const handleEvaluationSubmit = async (evaluationData: EvaluationData) => {
    if (!evaluationModalState) return;

    const evaluation: EvaluationParams = evaluationData.skipped
      ? { evaluation_skipped: true }
      : {
          evaluation_closeness: evaluationData.closeness,
          evaluation_relationship_type: evaluationData.relationshipType,
          ...(evaluationData.relationshipTypeDetail && {
            evaluation_relationship_type_detail: evaluationData.relationshipTypeDetail,
          }),
          evaluation_skipped: false,
        };

    let succeeded = false;
    let errorMsg = '';
    const flowType = evaluationModalState.type;

    if (flowType === 'request') {
      await requestFriend({
        userId: user.id,
        friendRequestType: evaluationModalState.friendType,
        updatePastPosts: evaluationModalState.updatePastPosts,
        evaluation,
        onSuccess: () => {
          succeeded = true;
        },
        onError: (msg: string) => {
          errorMsg = msg;
        },
      });
    } else {
      await acceptFriendRequest({
        userId: user.id,
        friendType: evaluationModalState.friendType,
        updatePastPosts: evaluationModalState.updatePastPosts,
        evaluation,
        onSuccess: () => {
          succeeded = true;
        },
        onError: () => {
          errorMsg = t('temporary_error') || '';
        },
      });
    }

    setEvaluationModalState(null);

    if (succeeded) {
      if (flowType === 'request') {
        openToast({ message: t('friend_request_success') || '' });
        onClickRequest?.();
      } else {
        openToast({ message: t('friend_accept_success') || '' });
        onClickConfirm?.();
        setIsVisitProfileDialogVisible(true);
      }
    } else {
      openToast({ message: errorMsg });
    }
  };

  // Evaluation modal close → show failure toast
  const handleEvaluationClose = () => {
    if (!evaluationModalState) return;

    if (evaluationModalState.type === 'request') {
      openToast({ message: t('friend_evaluation.request_failed') });
    } else {
      openToast({ message: t('friend_evaluation.accept_failed') });
    }
    setEvaluationModalState(null);
  };

  const trackEvent = useTrackEvent();

  const handleClickConfirm = (e: MouseEvent) => {
    e.stopPropagation();
    if (previewMode) return;
    // Modal-open events: distinct from the ultimate confirm path (which
    // backend captures via the API call). Lets us see how many users
    // open the accept-friend modal but back out — request-acceptance
    // hesitation signal.
    trackEvent('friend_accept_modal_opened', { friend_id: user.id });
    setIsFriendTypeSelectModalVisible({ visible: true, type: 'accept' });
  };

  const handleClickRejectFriendRequest = (e: MouseEvent) => {
    e.stopPropagation();
    if (previewMode) return;
    trackEvent('friend_reject_modal_opened', { friend_id: user.id });
    setIsRejectFriendRequestDialogVisible(true);
  };

  const handleClickUnfriend = (e: MouseEvent) => {
    e.stopPropagation();
    if (previewMode) return;
    trackEvent('friend_unfriend_modal_opened', { friend_id: user.id });
    setIsUnfriendDialogVisible(true);
  };

  const handleClickCancelRequest = (e: MouseEvent) => {
    e.stopPropagation();
    if (previewMode) return;
    trackEvent('friend_cancel_request_modal_opened', { friend_id: user.id });
    setIsCancelFriendRequestDialogVisible(true);
  };

  const handleClickDeleteRecommendation = async (e: MouseEvent) => {
    e.stopPropagation();
    if (previewMode) return;
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

  const handleClickRequest = (e: MouseEvent) => {
    e.stopPropagation();
    if (previewMode) return;
    trackEvent('friend_request_modal_opened', { friend_id: user.id });
    setIsFriendTypeSelectModalVisible({ visible: true, type: 'request' });
  };

  const PrimaryButton = isUserPage ? Button.Highlight : Button.Primary;

  const ButtonRow = isUserPage ? Layout.FlexRow : CompactButtonRow;
  const buttonRowProps = isUserPage ? { gap: 8, w: '100%' as const } : { gap: 8 };
  const sizingProp = isUserPage
    ? { sizing: 'stretch' as const }
    : { fontType: 'label-large' as const };

  return (
    <>
      <ButtonRow {...buttonRowProps}>
        {areFriends(user) ? (
          <Button.Secondary
            status="normal"
            text={t('unfriend')}
            {...sizingProp}
            onClick={handleClickUnfriend}
          />
        ) : type === 'requests' || receivedFriendRequest(user) ? (
          isUserPage ? (
            <PrimaryButton
              status="normal"
              text={t('reply_to_request')}
              {...sizingProp}
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                if (previewMode) return;
                setIsReplyDialogVisible(true);
              }}
            />
          ) : (
            <>
              <PrimaryButton
                status="normal"
                text={t('confirm')}
                {...sizingProp}
                onClick={handleClickConfirm}
              />
              <Button.Secondary
                status="normal"
                text={t('reject')}
                {...sizingProp}
                onClick={handleClickRejectFriendRequest}
              />
            </>
          )
        ) : (
          <>
            {type === 'sent_requests' || sentFriendRequest(user) ? (
              isUserPage ? (
                <RequestedButton
                  status="normal"
                  text={t('requested_friend')}
                  {...sizingProp}
                  onClick={handleClickCancelRequest}
                />
              ) : (
                <>
                  <PrimaryButton status="completed" text={t('requested')} {...sizingProp} />
                  <Button.Secondary
                    status="normal"
                    text={t('cancel')}
                    {...sizingProp}
                    onClick={handleClickCancelRequest}
                  />
                </>
              )
            ) : (
              <PrimaryButton
                status="normal"
                text={t('request')}
                {...sizingProp}
                onClick={handleClickRequest}
              />
            )}
            {type === 'recommended' && (
              <Button.Secondary
                status="normal"
                text={t('block_recommendation')}
                {...sizingProp}
                onClick={handleClickDeleteRecommendation}
              />
            )}
          </>
        )}
      </ButtonRow>
      {isReplyDialogVisible && (
        <CommonDialog
          visible={isReplyDialogVisible}
          title={t('reply_dialog.title')}
          titleType="title-medium"
          cancelText={t('reply_dialog.reject')}
          confirmText={t('reply_dialog.accept')}
          cancelTextColor="WARNING"
          onClickConfirm={() => {
            setIsReplyDialogVisible(false);
            setIsFriendTypeSelectModalVisible({ visible: true, type: 'accept' });
          }}
          onClickCancel={() => {
            setIsReplyDialogVisible(false);
            setIsRejectFriendRequestDialogVisible(true);
          }}
          onClickClose={() => setIsReplyDialogVisible(false)}
        />
      )}
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
              ? handleFriendTypeConfirmForAccept
              : handleFriendTypeConfirmForRequest
          }
          onClickClose={() => setIsFriendTypeSelectModalVisible(null)}
          type={isFriendTypeSelectModalVisible.type}
        />
      )}
      {!!evaluationModalState && (
        <FriendEvaluationModal
          visible={evaluationModalState.visible}
          type={evaluationModalState.type}
          username={user.username}
          onSubmit={handleEvaluationSubmit}
          onClose={handleEvaluationClose}
        />
      )}
      {isVisitProfileDialogVisible && (
        <CommonDialog
          visible={isVisitProfileDialogVisible}
          title={t('visit_profile_dialog.title', { user: user.username })}
          cancelText={t('visit_profile_dialog.cancel')}
          confirmText={t('visit_profile_dialog.confirm')}
          onClickConfirm={() => {
            setIsVisitProfileDialogVisible(false);
            navigate(`/users/${user.username}`);
          }}
          onClickClose={() => setIsVisitProfileDialogVisible(false)}
        />
      )}
    </>
  );
}

export default FriendStatus;
