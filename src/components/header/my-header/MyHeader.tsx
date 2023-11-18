import { useNavigate } from 'react-router-dom';
import { Font, Layout } from '@design-system';
import Icon from '../icon/Icon';

interface MyHeaderProps {
  onClickHamburger: () => void;
}

function MyHeader({ onClickHamburger }: MyHeaderProps) {
  const navigate = useNavigate();

  const handleEditStatus = () => {
    // 수정 페이지로 이동
    navigate('/status/edit');
  };

  return (
    <>
      <Layout.FlexRow>
        <Font.Display type="24_regular">My Profile</Font.Display>
      </Layout.FlexRow>
      <Layout.FlexRow gap={8} alignItems="center">
        <Icon name="add_post" size={44} onClick={handleEditStatus} />
        <Icon name="top_navigation_hamburger" size={44} onClick={onClickHamburger} />
      </Layout.FlexRow>
    </>
  );
}

export default MyHeader;
