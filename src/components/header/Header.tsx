import { Font, Layout, SvgIcon } from '@design-system';
import { HeaderWrapper, Noti } from './Header.styled';

function Header() {
  return (
    <HeaderWrapper>
      <Layout.FlexRow justifyContent="space-between" w="100%" alignItems="center" ph="default">
        <SvgIcon name="top_navigation_hamburger" size={36} />
        <Font.Display type="24_bold">Who Am I</Font.Display>
        <Noti to="/notifications">
          <SvgIcon name="top_navigation_noti" size={36} />
        </Noti>
      </Layout.FlexRow>
    </HeaderWrapper>
  );
}

export default Header;
