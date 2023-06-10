import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Layout } from '@design-system';
import Input from 'src/design-system/Inputs/Input';

function ConfirmPassword() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings' });
  const [passwordInput, setPasswordInput] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
  };

  const navigate = useNavigate();
  const handleClickConfirm = () => {
    navigate('/settings/reset-password');
  };

  return (
    <MainContainer>
      <TitleHeader title={t('confirm_password')} type="SUB" />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" gap={10} pl={24} pr={24}>
        <Input
          label={t('enter_your_current_password')}
          labelType="14_regular"
          name="password"
          type="password"
          value={passwordInput}
          onChange={handleChange}
        />
      </Layout.FlexCol>
      <Layout.Absolute w="100%" b="50px" pl={24} pr={24} flexDirection="column">
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
