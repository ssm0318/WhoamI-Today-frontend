import { format } from 'date-fns';
import { ChangeEvent, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import { RESEARCH_CONSENT_NOTION_URL } from '@constants/url';
import { Button, CheckBox, Layout, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { useBoundStore } from '@stores/useBoundStore';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

function calculateAge(dateOfBirth?: string) {
  if (!dateOfBirth) return null;
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

function ResearchConsent() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });
  const [researchConsentChecked, setResearchConsentChecked] = useState(false);
  const [parentalConsentChecked, setParentalConsentChecked] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const { signUpInfo, setSignUpInfo } = useBoundStore((state) => ({
    signUpInfo: state.signUpInfo,
    setSignUpInfo: state.setSignUpInfo,
  }));
  const navigate = useNavigate();
  const postMessage = usePostAppMessage();
  const trackEvent = useTrackEvent();

  const age = useMemo(() => calculateAge(signUpInfo.date_of_birth), [signUpInfo.date_of_birth]);
  const needsParentalConsent = researchConsentChecked && age !== null && age < 18;
  const dateOfSignature = format(new Date(), 'yyyy-MM-dd');
  const nextDisabled = needsParentalConsent && (!parentalConsentChecked || !guardianName.trim());

  const openExternalLink = (url: string) => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_BROWSER', { url });
      return;
    }
    window.open(url, '_blank');
  };

  const handleNext = () => {
    setSignUpInfo({
      research_agreement: researchConsentChecked,
      signature: needsParentalConsent ? guardianName.trim() : '',
      date_of_signature: needsParentalConsent ? dateOfSignature : '',
    });
    trackEvent('signup_step_advanced', {
      step: 'research',
      research_agreement: researchConsentChecked ? 'true' : 'false',
    });
    navigate('/signup/password');
  };

  const handleGuardianNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGuardianName(e.target.value);
  };

  return (
    <>
      <Layout.FlexCol gap={24} w="100%">
        <Typo type="body-medium" color="BLACK">
          <Trans
            t={t}
            i18nKey="research_desc"
            components={[
              <span />,
              <button
                type="button"
                onClick={() => openExternalLink(RESEARCH_CONSENT_NOTION_URL)}
                style={{
                  background: 'transparent',
                  border: 0,
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              />,
            ]}
          />
        </Typo>
        <Typo type="label-medium" color="BLACK">
          {t('research_optional_guide')}
        </Typo>
        <Layout.FlexRow w="100%">
          <CheckBox
            name="research_agreement"
            label={t('agree_to_research')}
            checked={researchConsentChecked}
            onChange={(e) => setResearchConsentChecked(e.target.checked)}
          />
        </Layout.FlexRow>
        {needsParentalConsent && (
          <Layout.FlexCol gap={14} w="100%">
            <Typo type="title-medium" color="MEDIUM_GRAY">
              {t('parental_permission')}
            </Typo>
            <Typo type="label-medium" color="BLACK">
              {t('need_parental_permission_error')}
            </Typo>
            <Layout.FlexRow w="100%">
              <CheckBox
                name="parental_research_consent"
                label={t('parent_research_consent')}
                checked={parentalConsentChecked}
                onChange={(e) => setParentalConsentChecked(e.target.checked)}
              />
            </Layout.FlexRow>
            <ValidatedInput
              label={t('parent_guardian_name')}
              name="parent_guardian_name"
              type="text"
              value={guardianName}
              onChange={handleGuardianNameChange}
              guide={t('printing_your_name_below')}
            />
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {t('date_of_signature')}: {dateOfSignature}
            </Typo>
          </Layout.FlexCol>
        )}
      </Layout.FlexCol>
      <Layout.Fixed l={0} b={30} w="100%" alignItems="center">
        <Button.Large
          type="gray_fill"
          status={nextDisabled ? 'disabled' : 'normal'}
          width={AUTH_BUTTON_WIDTH}
          text={t('next')}
          onClick={handleNext}
        />
      </Layout.Fixed>
    </>
  );
}

export default ResearchConsent;
