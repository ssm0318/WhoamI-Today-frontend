import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import TitleHeader from '@components/title-header/TitleHeader';
import { Button, Layout } from '@design-system';

function ConfirmPassword() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings' });

  const navigate = useNavigate();
  const handleClickConfirm = () => {
    navigate('/settings/reset-password');
  };
  return (
    <MainContainer>
      <TitleHeader title={t('confirm_password')} type="SUB" />
      <Layout.Absolute w="100%" b="50px" flexDirection="column">
        <Button.Large
          type="filled"
          status="normal"
          sizing="stretch"
          text={t('confirm')}
          onClick={handleClickConfirm}
        />
      </Layout.Absolute>
    </MainContainer>
  );
}

export default ConfirmPassword;
