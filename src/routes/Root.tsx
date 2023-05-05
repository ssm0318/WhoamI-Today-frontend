import { Outlet, redirect } from 'react-router-dom';
import Header from '@components/header/Header';
import Tab from '@components/tab/Tab';

function Root() {
  redirect('/today');

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Tab />
    </>
  );
}

export default Root;
