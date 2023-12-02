import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ExternalAnchor from '@components/_common/external-anchor/ExternalAnchor';
import {
  LEARN_MORE_ABOUT_WHOAMI_TODAY_NOTION_URL,
  PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_KO,
} from '@constants/url';
import { Button, CheckBox, Font, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

function ResearchIntro() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });
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
      <Layout.FlexCol gap={28}>
        <Trans i18nKey="sign_up.research_desc">
          <Font.Body type="18_regular" color="BLACK">
            text
            <ExternalAnchor link={PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_KO}>
              link
            </ExternalAnchor>
            text
          </Font.Body>
        </Trans>
        <CheckBox
          name={t('agree_to_research') || undefined}
          onChange={toggleAgree}
          checked={agree}
        />
        <ExternalAnchor link={LEARN_MORE_ABOUT_WHOAMI_TODAY_NOTION_URL}>
          {t('learn_more_about_whoami_today')}
        </ExternalAnchor>
      </Layout.FlexCol>
      <Layout.Fixed l={0} b="50px" w="100%" alignItems="center">
        <Button.Large
          type="gray_fill"
          status="normal"
          width={AUTH_BUTTON_WIDTH}
          text={t('next')}
          onClick={onClickNext}
        />
      </Layout.Fixed>
    </>
  );
}

export default ResearchIntro;
