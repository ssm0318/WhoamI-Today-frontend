import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import ValidatedPasswordInput from '@components/_common/validated-input/ValidatedPasswordInput';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { resetPassword } from '@utils/apis/user';

function ResetPassword() {
  const [t] = useTranslation('translation');

  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
  };

  const myProfile = useBoundStore((state) => state.myProfile);
  const navigate = useNavigate();
  const handleClickConfirm = () => {
    if (!myProfile) return;

    resetPassword({
      userId: myProfile.id,
      password: passwordInput,
      onSuccess: () => navigate('/settings'),
      onError: (e) => setPasswordError(e),
    });
  };

  return (
    <MainContainer>
      <SubHeader typo="title-large" title={t('settings.reset_password')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" gap={10} ph={24}>
        <ValidatedPasswordInput
          label={t('settings.enter_your_new_password')}
          labelType="14_regular"
          name="password"
          value={passwordInput}
          onChange={handleChange}
          error={passwordError}
          guide={t('sign_up.password_constraints')}
        />
      </Layout.FlexCol>
      <Layout.Absolute w="100%" b="50px" ph={24} flexDirection="column">
        <Button.Large
          type="filled"
          status="normal"
          sizing="stretch"
          text={t('settings.confirm')}
          onClick={handleClickConfirm}
        />
      </Layout.Absolute>
    </MainContainer>
  );
}

export default ResetPassword;
