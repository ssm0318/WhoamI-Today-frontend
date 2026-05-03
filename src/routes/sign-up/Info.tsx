import { format } from 'date-fns';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import {
  PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_EN,
  PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_KO,
} from '@constants/url';
import { Button, CheckBox, Layout, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { useBoundStore } from '@stores/useBoundStore';
import { validateBirthdate, validateInviterUsername } from '@utils/apis/user';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

function Info() {
  const [t, i18n] = useTranslation('translation', { keyPrefix: 'sign_up' });
  const [dateOfBirthInput, setDateOfBirthInput] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState<string | null>(null);
  const [friendUsernameInput, setFriendUsernameInput] = useState('');
  const [friendUsernameError, setFriendUsernameError] = useState<string | null>(null);
  const [privacyPolicyChecked, setPrivacyPolicyChecked] = useState(false);
  const [showAgeConfirmDialog, setShowAgeConfirmDialog] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState(0);
  const { openToast, setSignUpInfo } = useBoundStore((state) => ({
    openToast: state.openToast,
    setSignUpInfo: state.setSignUpInfo,
  }));
  const navigate = useNavigate();
  const postMessage = usePostAppMessage();
  const trackEvent = useTrackEvent();

  const privacyPolicyLink =
    i18n.language === 'ko-KR'
      ? PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_KO
      : PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_EN;

  const isValideDateOfBirth = (date: string) => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !Number.isNaN(dateObj.getTime());
  };

  const handleChangeDateOfBirth = (e: ChangeEvent<HTMLInputElement>) => {
    setDateOfBirthInput(e.target.value);
    if (dateOfBirthError) setDateOfBirthError(null);
  };

  const handleChangeFriendUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setFriendUsernameInput(e.target.value);
    if (friendUsernameError) setFriendUsernameError(null);
  };

  const calculateAge = (birthDate: string) => {
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age -= 1;
    }

    return age;
  };

  const onClickNext = () => {
    if (!isValideDateOfBirth(dateOfBirthInput)) {
      setDateOfBirthError(t('date_of_birth_error'));
      trackEvent('signup_validation_error', { step: 'info', error_type: 'date_of_birth' });
      return;
    }

    const proceedToAgeConfirm = () => {
      const age = calculateAge(dateOfBirthInput);
      setCalculatedAge(age);
      setShowAgeConfirmDialog(true);
    };

    const trimmed = friendUsernameInput.trim();
    if (!trimmed) {
      setFriendUsernameError(t('friend_username_required_error'));
      trackEvent('signup_validation_error', { step: 'info', error_type: 'missing_friend_code' });
      return;
    }

    validateInviterUsername({
      username: trimmed,
      onSuccess: (res) => {
        setSignUpInfo({
          inviter_id: res.inviter_id,
          current_ver: res.current_ver,
          user_group: res.user_group,
        });
        proceedToAgeConfirm();
      },
      onError: () => {
        setFriendUsernameError(t('friend_username_error'));
        trackEvent('signup_validation_error', { step: 'info', error_type: 'friend_code' });
      },
    });
  };

  const handleConfirmAge = () => {
    // Convert to YYYY-MM-DD format
    const birthdate = format(new Date(dateOfBirthInput), 'yyyy-MM-dd');

    validateBirthdate({
      birthdate,
      onSuccess: () => {
        trackEvent('signup_step_advanced', { step: 'info' });
        navigate('/signup/password');
      },
      onError: (errorMsg: string) => {
        openToast({
          message: errorMsg,
        });
        trackEvent('signup_validation_error', { step: 'info', error_type: 'birthdate_api' });
      },
    });

    setShowAgeConfirmDialog(false);
  };

  const handleClickPrivacyPolicy = () => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_BROWSER', {
        url: privacyPolicyLink,
      });
    } else {
      window.open(privacyPolicyLink, '_blank');
    }
  };

  const nextDisabled =
    !friendUsernameInput.trim() ||
    !dateOfBirthInput ||
    !!dateOfBirthError ||
    !privacyPolicyChecked ||
    !!friendUsernameError;

  return (
    <>
      <Layout.FlexCol gap={20} w="100%">
        <ValidatedInput
          label={t('friend_username')}
          name="friend_username"
          type="text"
          value={friendUsernameInput}
          onChange={handleChangeFriendUsername}
          error={friendUsernameError}
          guide={t('friend_username_guide')}
        />
        <ValidatedInput
          label={t('date_of_birth')}
          name="date_of_birth"
          type="date"
          value={dateOfBirthInput}
          onChange={handleChangeDateOfBirth}
          error={dateOfBirthError}
          guide={t('date_of_birth_guide')}
        />
        {/* Privacy related checks */}
        <Layout.FlexCol gap={10}>
          <Typo type="title-medium" color="MEDIUM_GRAY">
            {t('privacy_policy')}
          </Typo>
          <Typo type="label-medium" color="BLACK">
            {t('privacy_policy_guide')}
          </Typo>
          <a
            href={privacyPolicyLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              handleClickPrivacyPolicy();
            }}
          >
            <Typo type="label-medium" color="BLACK">
              📄{' '}
            </Typo>
            <Typo type="label-medium" color="BLACK" underline>
              {t('privacy_policy_link_view')}
            </Typo>
          </a>
          <Layout.FlexRow alignItems="center" gap={4} mt={10}>
            <CheckBox
              checked={privacyPolicyChecked}
              onChange={(e) => setPrivacyPolicyChecked(e.target.checked)}
            />
            <Typo type="label-large">{t('privacy_policy_agree')}</Typo>
          </Layout.FlexRow>
        </Layout.FlexCol>
      </Layout.FlexCol>
      <Layout.Fixed l={0} b={30} w="100%" alignItems="center">
        <Button.Large
          type="gray_fill"
          status={nextDisabled ? 'disabled' : 'normal'}
          width={AUTH_BUTTON_WIDTH}
          text={t('next')}
          onClick={onClickNext}
        />
      </Layout.Fixed>
      <CommonDialog
        visible={showAgeConfirmDialog}
        title={t('age_confirm_dialog_title')}
        content={t('age_confirm_dialog_content', { age: calculatedAge })}
        confirmText={t('age_confirm_dialog_yes')}
        cancelText={t('age_confirm_dialog_no')}
        onClickConfirm={handleConfirmAge}
        onClickClose={() => setShowAgeConfirmDialog(false)}
      />
    </>
  );
}

export default Info;
