import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Button, Font, Layout } from '@design-system';
import { User } from '@models/user';

interface Props {
  type: 'request' | 'friends' | 'search';
  user: User;
}

function FriendItem({ type, user }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.friends' });

  const handleClickAccept = () => {
    console.log('친구 요청 수락', user.id);
  };

  const handleClickDelete = (e: MouseEvent) => {
    e.stopPropagation();
    if (type === 'search') return;
    if (type === 'request') {
      console.log('친구 요청 거절', user.id);
      return;
    }

    console.log('친구 삭제', user.id);
  };

  const navigate = useNavigate();

  const handleClickItem = () => {
    navigate(`/users/${user.username}`);
  };

  return (
    <Layout.FlexRow
      w="100%"
      key={user.id}
      justifyContent="space-between"
      alignItems="center"
      ph={10}
      pv={4}
      onClick={handleClickItem}
    >
      <Layout.FlexRow alignItems="center" gap={7}>
        <ProfileImage imageUrl={user.profile_image} username={user.username} size={42} />
        <Font.Body type="14_semibold">{user.username}</Font.Body>
      </Layout.FlexRow>
      {type !== 'search' && (
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
      )}
    </Layout.FlexRow>
  );
}

export default FriendItem;
