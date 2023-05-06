import { Outlet, redirect } from 'react-router-dom';
import Header from '@components/header/Header';
import Tab from '@components/tab/Tab';

// body 0

function Root() {
  redirect('/today');

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#C4C4C4',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 500,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          backgroundColor: 'white',
        }}
      >
        <Header />
        <main
          style={{
            paddingTop: 50,
            paddingBottom: 80,
            height: '100%',
            border: '1px solid blue',
            backgroundColor: 'white',
          }}
        >
          <Outlet />
        </main>
        <Tab />
      </div>
    </div>
  );
}

export default Root;
