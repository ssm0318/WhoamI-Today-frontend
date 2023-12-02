import { useNavigate } from 'react-router-dom';
import { Font, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import Icon from '../icon/Icon';

interface MyHeaderProps {
  onClickHamburger: () => void;
}

function MyHeader({ onClickHamburger }: MyHeaderProps) {
  const myProfile = useBoundStore((state) => state.myProfile);
  const navigate = useNavigate();

  const handleEditStatus = () => {
    // 수정 페이지로 이동
    navigate('/status/edit');
  };

  return (
    <>
      <Layout.FlexRow>
        <Font.Display type="24_regular">{myProfile?.username}</Font.Display>
      </Layout.FlexRow>
      <Layout.FlexRow gap={8} alignItems="center">
        <Icon name="new_chat" size={44} onClick={handleEditStatus} />
        <Icon name="hamburger" size={44} onClick={onClickHamburger} />
      </Layout.FlexRow>
    </>
  );
}

export default MyHeader;
