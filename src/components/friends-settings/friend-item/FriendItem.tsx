import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Button, Font, Layout } from '@design-system';
import { User } from '@models/user';
import { acceptFriendRequest, breakFriend, rejectFriendRequest } from '@utils/apis/user';

interface Props {
  type: 'request' | 'friends' | 'search';
  user: User;
  updateList?: () => void;
}

function FriendItem({ type, user, updateList }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.friends' });

  const handleClickAccept = async (e: MouseEvent) => {
    e.stopPropagation();
    await acceptFriendRequest(user.id);
    updateList?.();
  };

  const handleClickDelete = async (e: MouseEvent) => {
    e.stopPropagation();

    if (type === 'request') {
      await rejectFriendRequest(user.id);
      updateList?.();
      return;
    }

    if (type === 'friends') {
      await breakFriend(user.id);
      updateList?.();
    }
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
