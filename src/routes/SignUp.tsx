import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';

function SignUp() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });

  return (
    <MainContainer>
      <TitleHeader title={t('create_an_account')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 80} w="100%" pl={24} pr={24}>
        <Outlet />
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default SignUp;
