import { useTranslation } from 'react-i18next';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Button, Font, Layout } from '@design-system';
import { User } from '@models/user';

interface Props {
  type: 'request' | 'friends';
  friend: User;
}

function FriendItem({ type, friend }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.friends' });

  const handleClickAccept = () => {
    console.log('친구 요청 수락', friend.id);
  };

  const handleClickDelete = () => {
    if (type === 'request') {
      console.log('친구 요청 거절', friend.id);
      return;
    }

    console.log('친구 삭제', friend.id);
  };

  return (
    <Layout.FlexRow
      w="100%"
      key={friend.id}
      justifyContent="space-between"
      alignItems="center"
      pl={10}
      pt={4}
      pr={10}
      pb={4}
    >
      <Layout.FlexRow alignItems="center" gap={7}>
        <ProfileImage imageUrl={friend.profile_image} username={friend.username} size={42} />
        <Font.Body type="14_semibold">{friend.username}</Font.Body>
      </Layout.FlexRow>
      <Layout.FlexRow gap={10}>
        {type === 'request' && (
          <Button.Small
            type="gray_fill"
            status="normal"
            text={t('request_list.accept')}
            onClick={handleClickAccept}
          />
        )}
        <DeleteButton onClick={handleClickDelete} />
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default FriendItem;
