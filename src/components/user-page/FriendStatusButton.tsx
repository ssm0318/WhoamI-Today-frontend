import { useTranslation } from 'react-i18next';
import { Button } from '@design-system';
import { UserProfile } from '@models/user';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  requestFriend,
} from '@utils/apis/user';

interface FriendStatusButtonProps {
  user: UserProfile;
  callback?: () => Promise<void>;
}

function FriendStatusButton({ user, callback }: FriendStatusButtonProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });

  const { are_friends, received_friend_request_from, sent_friend_request_to } = user;

  const handleAcceptFriendRequest = async () => {
    await acceptFriendRequest(user.id);
    callback?.();
  };

  const handleRejectFriendRequest = async () => {
    await rejectFriendRequest(user.id);
    callback?.();
  };

  const handleCancelFriendRequest = async () => {
    await cancelFriendRequest(user.id);
    callback?.();
  };

  const handleRequestFriendRequest = async () => {
    await requestFriend(user.id);
    callback?.();
  };

  if (are_friends) {
    return <Button.Small text={t('friend')} type="outlined" status="normal" />;
  }

  if (received_friend_request_from) {
    return (
      <>
        <Button.Small
          text={t('accept')}
          type="outlined"
          status="normal"
          onClick={handleAcceptFriendRequest}
        />
        <Button.Small
          text={t('reject')}
          type="outlined"
          status="normal"
          onClick={handleRejectFriendRequest}
        />
      </>
    );
  }

  if (sent_friend_request_to) {
    return (
      <>
        <Button.Small text={t('requested')} type="outlined" status="normal" />
        <Button.Small
          text={t('cancel')}
          type="outlined"
          status="normal"
          onClick={handleCancelFriendRequest}
        />
      </>
    );
  }

  return (
    <Button.Small
      text={t('request_a_friend')}
      type="outlined"
      status="normal"
      onClick={handleRequestFriendRequest}
    />
  );
}

export default FriendStatusButton;
