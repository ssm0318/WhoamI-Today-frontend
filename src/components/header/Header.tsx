import { Button, Font, Layout } from '@design-system';
import { HeaderWrapper, Logo, Menu, Noti } from './Header.styled';

function Header() {
  return (
    <HeaderWrapper>
      <Layout.FlexRow justifyContent="space-between" w="100%" alignItems="center">
        <Menu>menu</Menu>
        {/* 예제 코드 */}
        <Layout.FlexCol>
          <Font.Body type="12_regular" color="SYSTEM_ERROR" ml={2}>
            123
          </Font.Body>
          <Font.Display type="24_bold">123</Font.Display>
        </Layout.FlexCol>
        <Layout.FlexRow>
          <Button.Large type="white_fill" text="버튼" status="normal" />
        </Layout.FlexRow>
        <Logo>WhoAmI Today</Logo>
        <Noti to="/notifications">noti</Noti>
      </Layout.FlexRow>
    </HeaderWrapper>
  );
}

export default Header;
