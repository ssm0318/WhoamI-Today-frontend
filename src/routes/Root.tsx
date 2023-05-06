import { Outlet, redirect } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import Header from '@components/header/Header';
import Tab from '@components/tab/Tab';
import { MainWrapper } from '@styles/wrappers';

function Root() {
  redirect('/today');

  return (
    <MainContainer>
      <Header />
      <MainWrapper>
        <Outlet />
      </MainWrapper>
      <Tab />
    </MainContainer>
  );
}

export default Root;
