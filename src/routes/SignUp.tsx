import { Outlet } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';

function SignUp() {
  return (
    <MainContainer>
      <Outlet />
    </MainContainer>
  );
}

export default SignUp;
