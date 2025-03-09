import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout } from '@design-system';

interface UserHeaderProps {
  username?: string;
  userId?: number;
  onClickMore: () => void;
}

function UserHeader({ username, userId, onClickMore }: UserHeaderProps) {
  const navigate = useNavigate();

  const handleClickPing = async () => {
    if (!userId) return;
    navigate(`/users/${userId}/ping`);
  };

  const handleClickMore = () => {
    onClickMore();
  };

  if (!username) return null;
  return (
    <SubHeader
      title={username}
      RightComponent={
        <Layout.FlexRow gap={8} alignItems="center">
          <Icon name="dots_menu" size={44} onClick={handleClickMore} />
          <Icon name="question_send" size={22} onClick={handleClickPing} />
        </Layout.FlexRow>
      }
    />
  );
}

export default UserHeader;
