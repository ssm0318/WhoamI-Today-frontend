import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ExternalAnchor from '@components/_common/external-anchor/ExternalAnchor';
import {
  LEARN_MORE_ABOUT_WHOAMI_TODAY_NOTION_URL,
  PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_EN,
  PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_KO,
} from '@constants/url';
import { Button, Font, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

function ResearchIntro() {
  const [t, i18n] = useTranslation('translation', { keyPrefix: 'sign_up' });
  const [agree, setAgree] = useState(false);

  const setSignUpInfo = useBoundStore((state) => state.setSignUpInfo);

  const toggleAgree = () => setAgree((prev) => !prev);

  const navigate = useNavigate();
  const onClickNext = () => {
    if (agree) {
      setSignUpInfo({ research_agreement: true });
      navigate('/signup/research-consent-form');
      return;
    }

    setSignUpInfo({ research_agreement: false });
    navigate('/signup/username');
  };

  return (
    <>
      {i18n.language === 'ko' ? (
        <Font.Body type="18_regular" color="BASIC_BLACK">
          WhoAmI Today는 워싱턴 대학교의 연구원 그룹이 소셜 미디어를 청소년들의 요구에 더 맞게
          만들기 위해 개발한 비영리 서비스입니다.{' '}
          <ExternalAnchor link={PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_KO}>
            개인 정보 보호 정책/동의 양식
          </ExternalAnchor>
          에 동의하는 경우, 귀하는 귀하의 데이터에 대한 (통합 및 식별되지 않은) 분석을 포함하는
          당사의 연구에 참여하는 것에 동의합니다.
        </Font.Body>
      ) : (
        <Font.Body type="18_regular" color="BASIC_BLACK">
          WhoAmI Today is a non-profit service developed by a group of researchers at the University
          of Washington to make social media more aligned with the needs of adolescents. If you
          agree to the{' '}
          <ExternalAnchor link={PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_EN}>
            privacy policy/consent form
          </ExternalAnchor>
          , you agree to participating in our research, which includes the (aggregated and
          deidentified) analysis of your data.
        </Font.Body>
      )}
      <div>
        <input id="research-content" type="checkbox" onChange={toggleAgree} />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="research-content">{t('agree_to_research')}</label>
      </div>
      <ExternalAnchor link={LEARN_MORE_ABOUT_WHOAMI_TODAY_NOTION_URL}>
        {t('learn_more_about_whoami_today')}
      </ExternalAnchor>
      <Layout.Absolute w="100%" b="50px" flexDirection="column">
        <Button.Large
          type="filled"
          status="normal"
          sizing="stretch"
          text={t('next')}
          onClick={onClickNext}
        />
      </Layout.Absolute>
    </>
  );
}

export default ResearchIntro;
