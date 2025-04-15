import { format } from 'date-fns';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import {
  PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_EN,
  PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_KO,
} from '@constants/url';
import { Button, CheckBox, Layout, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { useBoundStore } from '@stores/useBoundStore';
import { validateInviterBirthdate } from '@utils/apis/user';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

function Info() {
  const [t, i18n] = useTranslation('translation', { keyPrefix: 'sign_up' });
  const [friendEmailInput, setFriendEmailInput] = useState('');
  const [friendEmailError, setFriendEmailError] = useState<string | null>(null);
  const [dateOfBirthInput, setDateOfBirthInput] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState<string | null>(null);
  const [privacyPolicyChecked, setPrivacyPolicyChecked] = useState(false);
  const [validateError, setValidateError] = useState<boolean>(false);
  const { setSignUpInfo } = useBoundStore((state) => ({
    setSignUpInfo: state.setSignUpInfo,
  }));
  const navigate = useNavigate();
  const postMessage = usePostAppMessage();

  const privacyPolicyLink =
    i18n.language === 'ko-KR'
      ? PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_KO
      : PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_EN;

  const handleChangeFriendEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setFriendEmailInput(e.target.value);
    if (friendEmailError) setFriendEmailError(null);
  };

  const isValideDateOfBirth = (date: string) => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !Number.isNaN(dateObj.getTime());
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChangeDateOfBirth = (e: ChangeEvent<HTMLInputElement>) => {
    setDateOfBirthInput(e.target.value);
    if (dateOfBirthError) setDateOfBirthError(null);
  };

  const onClickNext = () => {
    let hasErrors = false;

    if (!isValideDateOfBirth(dateOfBirthInput)) {
      setDateOfBirthError(t('date_of_birth_error'));
      hasErrors = true;
    }

    if (!isValidEmail(friendEmailInput)) {
      setFriendEmailError(t('friend_email_error'));
      hasErrors = true;
    }

    if (!hasErrors) {
      // YYYY-MM-DD 형식으로 변환
      const birthdate = format(new Date(dateOfBirthInput), 'yyyy-MM-dd');

      validateInviterBirthdate({
        birthdate,
        email: friendEmailInput,
        onSuccess: (res) => {
          setSignUpInfo({
            inviter_id: res.inviter_id,
            user_group: res.user_group,
            current_ver: res.current_ver,
          });
          navigate('/signup/password');
        },
        onError: (errorMsg: string) => {
          if (errorMsg) {
            setValidateError(true);
          }
        },
      });
    }
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

  return (
    <>
      <Layout.FlexCol gap={30} w="100%">
        <ValidatedInput
          label={t('friend_email')}
          name="friend_email"
          type="email"
          inputMode="email"
          value={friendEmailInput}
          onChange={handleChangeFriendEmail}
          error={friendEmailError}
          guide={t('friend_email_guide')}
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
        {/* 개인정보 관련 체크 */}
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

      <Layout.Fixed l={0} b="50px" w="100%" alignItems="center">
        <Button.Large
          type="gray_fill"
          status={
            !friendEmailInput ||
            friendEmailError ||
            !dateOfBirthInput ||
            dateOfBirthError ||
            !privacyPolicyChecked
              ? 'disabled'
              : 'normal'
          }
          width={AUTH_BUTTON_WIDTH}
          text={t('next')}
          onClick={onClickNext}
        />
        {validateError && (
          <Typo type="label-medium" color="WARNING">
            {t('validate_error')}
          </Typo>
        )}
      </Layout.Fixed>
    </>
  );
}

export default Info;
