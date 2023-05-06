import { Font } from '@design-system';
import { HeaderWrapper, Logo, Menu, Noti } from './Header.styled';

function Header() {
  return (
    <HeaderWrapper>
      <Menu>menu</Menu>
      {/* Font 예제 코드 */}
      <Font.Body type="12_regular">123</Font.Body>
      <Font.Display type="24_bold">123</Font.Display>
      <Logo>WhoAmI Today</Logo>
      <Noti to="/notifications">noti</Noti>
    </HeaderWrapper>
  );
}

export default Header;
