import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmBottomModal from '@components/_common/bottom-modal/ConfirmBottomModal';
import MainContainer from '@components/_common/main-container/MainContainer';
import ValidatedPasswordInput from '@components/_common/validated-input/ValidatedPasswordInput';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Font, Layout } from '@design-system';

function DeleteAccount() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings' });

  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
    if (e.target.value === 'error') {
      setPasswordError(t('password_invalid'));
    }
    if (passwordError) setPasswordError(null);
  };

  const handleClickContinue = () => {
    setShowDeleteAccountModal(true);
  };

  const handleClickConfirmDeleteAccount = () => {
    // TODO
  };

  return (
    <MainContainer>
      <TitleHeader type="SUB" title={t('delete_account')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" pl={24} pr={24}>
        <Font.Display type="14_regular" mb={22}>
          {t('please_check_your_password')}
        </Font.Display>
        <ValidatedPasswordInput
          label={t('password')}
          name="password"
          value={passwordInput}
          onChange={handleChange}
          error={passwordError}
        />
      </Layout.FlexCol>
      <Button.Large
        type="filled"
        status="normal"
        text={t('continue')}
        sizing="stretch"
        onClick={handleClickContinue}
      />
      {showDeleteAccountModal && (
        <ConfirmBottomModal
          isVisible={showDeleteAccountModal}
          setIsVisible={setShowDeleteAccountModal}
          title={t('delete_account')}
          confirmText={t('confirm')}
          onConfirm={handleClickConfirmDeleteAccount}
        >
          <Font.Body type="18_regular" mt={38} mb={70} textAlign="center">
            {t('are_you_sure')}
          </Font.Body>
        </ConfirmBottomModal>
      )}
    </MainContainer>
  );
}

export default DeleteAccount;
