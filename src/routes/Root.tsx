import { Outlet, redirect } from 'react-router-dom';
import Header from '@components/header/Header';
import Tab from '@components/tab/Tab';
import { BOTTOM_TABBAR_HEIGHT, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { MainWrapper, RootContainer } from '@styles/wrappers';

function Root() {
  redirect('/home');

  return (
    <Layout.FlexRow justifyContent="center" bgColor="BASIC_BLACK" h="100vh" w="100%">
      <RootContainer w="100%" h="100vh" bgColor="BASIC_WHITE">
        <Header />
        <MainWrapper
          alignItems="center"
          pt={TOP_NAVIGATION_HEIGHT}
          pb={BOTTOM_TABBAR_HEIGHT}
          bgColor="BACKGROUND_COLOR"
        >
          <Outlet />
        </MainWrapper>
        <Tab />
      </RootContainer>
    </Layout.FlexRow>
  );
}

export default Root;
