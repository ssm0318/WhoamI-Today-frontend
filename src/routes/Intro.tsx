import { useTranslation } from 'react-i18next';
import MainContainer from '@components/_common/main-container/MainContainer';
import { Button, Layout } from '@design-system';

function Intro() {
  const [t] = useTranslation('translation', { keyPrefix: 'intro' });
  return (
    <MainContainer>
      <Layout.Absolute w="100%" b="50px" flexDirection="column">
        <Button.Large
          type="filled"
          status="normal"
          to="/signup"
          text={t('sign_up')}
          sizing="stretch"
        />
        <Button.Large
          type="filled"
          status="normal"
          to="/signin"
          text={t('sign_in')}
          sizing="stretch"
        />
      </Layout.Absolute>
    </MainContainer>
  );
}

export default Intro;
