import { Layout } from '@design-system';
import { HeaderWrapper, Logo, Menu, Noti } from './Header.styled';

function Header() {
  return (
    <HeaderWrapper>
      <Layout.FlexRow justifyContent="space-between" w="100%" alignItems="center">
        <Menu>menu</Menu>
        <Logo>WhoAmI Today</Logo>
        <Noti to="/notifications">noti</Noti>
      </Layout.FlexRow>
    </HeaderWrapper>
  );
}

export default Header;
