import { HeaderWrapper, Logo, Menu, Noti } from './Header.styled';

function Header() {
  return (
    <HeaderWrapper>
      <Menu>menu</Menu>
      <Logo>WhoAmI Today</Logo>
      <Noti to="/notifications">noti</Noti>
    </HeaderWrapper>
  );
}

export default Header;
