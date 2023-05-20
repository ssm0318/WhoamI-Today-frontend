import { useNavigate } from 'react-router-dom';
import { Font, Layout, SvgIcon } from '@design-system';
import { signOut } from '@utils/apis/user';
import { HeaderWrapper, Noti } from './Header.styled';

function Header() {
  const navigate = useNavigate();
  const onClickLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <HeaderWrapper>
      <Layout.FlexRow justifyContent="space-between" w="100%" alignItems="center" ph="default">
        {/* FIXME: 로그아웃 임시구현, 기능 추가 이후 수정 필요 */}
        <button type="button" onClick={() => onClickLogout()}>
          <SvgIcon name="top_navigation_hamburger" size={36} />
        </button>
        <Font.Display type="24_bold">Who Am I</Font.Display>
        <Noti to="/notifications">
          <SvgIcon name="top_navigation_noti" size={36} />
        </Noti>
      </Layout.FlexRow>
    </HeaderWrapper>
  );
}

export default Header;
