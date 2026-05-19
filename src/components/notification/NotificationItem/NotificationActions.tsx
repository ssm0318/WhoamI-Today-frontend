import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FriendEvaluationModal, {
  EvaluationData,
} from '@components/_common/friend-evaluation-modal/FriendEvaluationModal';
import FriendTypeSelectModal from '@components/_common/friend-type-select-modal/FriendTypeSelectModal';
import { Button, Layout } from '@design-system';
import { Connection } from '@models/api/friends';
import { Notification } from '@models/notification';
import { useBoundStore } from '@stores/useBoundStore';
import { respondToChatRequest } from '@utils/apis/chat';
import { acceptFriendRequest, EvaluationParams, rejectFriendRequest } from '@utils/apis/user';

interface Props {
  item: Notification;
  onActioned: () => void;
}

function NotificationActions({ item, onActioned }: Props) {
  const [tFriend] = useTranslation('translation', {
    keyPrefix: 'friends.explore_friends.friend_item',
  });
  const [tChat] = useTranslation('translation', {
    keyPrefix: 'chat.request.notification_action',
  });
  const { openToast } = useBoundStore((s) => ({ openToast: s.openToast }));

  const [busy, setBusy] = useState(false);
  const [friendTypeSelectVisible, setFriendTypeSelectVisible] = useState(false);
  const [evaluationState, setEvaluationState] = useState<{
    friendType: Connection;
    updatePastPosts?: boolean;
  } | null>(null);

  const actor = item.recent_actors[0];
  if (!actor) return null;
  if (!item.is_friend_request && !item.is_chat_request) return null;

  const handleFriendTypeConfirm = ({
    friendType,
    updatePastPosts,
  }: {
    friendType: Connection;
    updatePastPosts?: boolean;
  }) => {
    setFriendTypeSelectVisible(false);
    setEvaluationState({ friendType, updatePastPosts });
  };

  const handleEvaluationSubmit = async (data: EvaluationData) => {
    if (!evaluationState) return;
    const evaluation: EvaluationParams = {
      evaluation_closeness: data.closeness,
      evaluation_relationship_type: data.relationshipType,
      ...(data.relationshipTypeDetail && {
        evaluation_relationship_type_detail: data.relationshipTypeDetail,
      }),
    };
    let succeeded = false;
    await acceptFriendRequest({
      userId: actor.id,
      friendType: evaluationState.friendType,
      updatePastPosts: evaluationState.updatePastPosts,
      evaluation,
      onSuccess: () => {
        succeeded = true;
      },
      onError: () => {},
    });
    setEvaluationState(null);
    if (succeeded) {
      openToast({ message: tFriend('friend_accept_success') ?? '' });
      onActioned();
    } else {
      openToast({ message: tFriend('temporary_error') ?? '' });
    }
  };

  const handleEvaluationClose = () => {
    openToast({ message: tFriend('friend_evaluation.accept_failed') ?? '' });
    setEvaluationState(null);
  };

  const handleClickFriendConfirm = (e: MouseEvent) => {
    e.stopPropagation();
    setFriendTypeSelectVisible(true);
  };

  const handleClickFriendReject = async (e: MouseEvent) => {
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    await rejectFriendRequest({
      userId: actor.id,
      onSuccess: () => openToast({ message: tFriend('friend_reject_success') ?? '' }),
      onError: () => openToast({ message: tFriend('temporary_error') ?? '' }),
    });
    setBusy(false);
    onActioned();
  };

  const handleClickChatRespond = async (e: MouseEvent, accepted: boolean) => {
    e.stopPropagation();
    if (busy || item.target_id === null) return;
    setBusy(true);
    try {
      await respondToChatRequest(item.target_id, accepted);
      openToast({ message: tChat(accepted ? 'accepted_toast' : 'ignored_toast') ?? '' });
      onActioned();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Layout.FlexRow w="100%" gap={8}>
        {item.is_friend_request ? (
          <>
            <Button.Primary
              status="normal"
              text={tFriend('confirm')}
              fontType="label-medium"
              onClick={handleClickFriendConfirm}
            />
            <Button.Secondary
              status="normal"
              text={tFriend('reject')}
              fontType="label-medium"
              onClick={handleClickFriendReject}
            />
          </>
        ) : (
          <>
            <Button.Primary
              status="normal"
              text={tChat('accept')}
              fontType="label-medium"
              onClick={(e) => handleClickChatRespond(e, true)}
            />
            <Button.Secondary
              status="normal"
              text={tChat('ignore')}
              fontType="label-medium"
              onClick={(e) => handleClickChatRespond(e, false)}
            />
          </>
        )}
      </Layout.FlexRow>
      {friendTypeSelectVisible && (
        <FriendTypeSelectModal
          visible={friendTypeSelectVisible}
          type="accept"
          onClickConfirm={handleFriendTypeConfirm}
          onClickClose={() => setFriendTypeSelectVisible(false)}
        />
      )}
      {evaluationState && (
        <FriendEvaluationModal
          visible
          type="accept"
          username={actor.username}
          onSubmit={handleEvaluationSubmit}
          onClose={handleEvaluationClose}
        />
      )}
    </>
  );
}

export default NotificationActions;
