import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import { Font } from '@design-system';

function SignUp() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });

  return (
    <MainContainer>
      <Font.Display type="24_bold" textAlign="center">
        {t('create_an_account')}
      </Font.Display>
      <Outlet />
    </MainContainer>
  );
}

export default SignUp;
