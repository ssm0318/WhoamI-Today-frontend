import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { Font, Layout } from '@design-system';
import { User } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { HeaderWrapper } from '../Header.styled';

interface UserHeaderProps {
  onClickHamburger?: () => void;
  user?: User;
}

function UserHeader({ onClickHamburger, user }: UserHeaderProps) {
  const navigate = useNavigate();
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const isMyPage = user?.id === myProfile?.id;

  const handleEditCheckIn = () => {
    // 수정 페이지로 이동
    navigate('/check-in/edit');
  };

  const handleClickChat = () => {
    //
  };

  const handleClickMore = () => {
    //
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!user) return null;
  return (
    <HeaderWrapper>
      <Layout.FlexRow justifyContent="space-between" w="100%" alignItems="center" pv={10}>
        <Layout.FlexRow>
          {isMyPage ? (
            <Font.Display type="24_regular">My Profile</Font.Display>
          ) : (
            <Icon name="arrow_left" size={44} onClick={handleGoBack} />
          )}
        </Layout.FlexRow>
        <Layout.FlexRow gap={8} alignItems="center">
          {isMyPage ? (
            <>
              <Icon name="edit_outline" size={44} onClick={handleEditCheckIn} />
              <Icon name="hamburger" size={44} onClick={onClickHamburger} />
            </>
          ) : (
            <>
              <Icon name="dots_menu" size={44} onClick={handleClickMore} />
              <Icon name="chat_outline" size={44} onClick={handleClickChat} />
            </>
          )}
        </Layout.FlexRow>
      </Layout.FlexRow>
    </HeaderWrapper>
  );
}

export default UserHeader;
