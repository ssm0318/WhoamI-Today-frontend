import { useTranslation } from 'react-i18next';
import { Button } from '@design-system';
import { UserProfile } from '@models/user';

function FriendStatusButton({ user }: { user: UserProfile }) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });

  const { are_friends, received_friend_request_from, sent_friend_request_to } = user;

  if (are_friends) {
    return <Button.Small text={t('friend')} type="outlined" status="normal" />;
  }

  if (received_friend_request_from) {
    return (
      <>
        <Button.Small text={t('accept')} type="outlined" status="normal" />
        <Button.Small text={t('reject')} type="outlined" status="normal" />
      </>
    );
  }

  if (sent_friend_request_to) {
    return <Button.Small text={t('requested')} type="outlined" status="normal" />;
  }

  return <Button.Small text={t('request_a_friend')} type="outlined" status="normal" />;
}

export default FriendStatusButton;
