import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import { RESEARCH_SIGNUP_FORM_URL } from '@constants/url';
import { Button, Layout, Typo } from '@design-system';

function ResearchIntro() {
  const [t] = useTranslation('translation', { keyPrefix: 'research_intro' });
  const navigate = useNavigate();

  const handleClickSignUpForm = () => {
    navigate(RESEARCH_SIGNUP_FORM_URL);
  };

  const handleClickSignIn = () => {
    navigate('/signin');
  };

  return (
    <MainContainer>
      <Layout.FlexCol w="100%" h="100%" justifyContent="center" alignItems="center">
        <Typo type="title-medium" mb={20}>
          {t('title')}
        </Typo>
        <Typo type="body-medium">{t('description')}</Typo>
        <Layout.FlexCol w="100%" gap={30} ph={40} mt={50}>
          <Button.Confirm
            status="normal"
            onClick={handleClickSignUpForm}
            text={t('has_not_account')}
            sizing="stretch"
          />
          <Button.Confirm
            status="normal"
            onClick={handleClickSignIn}
            text={t('has_account')}
            sizing="stretch"
          />
        </Layout.FlexCol>
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default ResearchIntro;
