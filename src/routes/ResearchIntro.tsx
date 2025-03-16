import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import { RESEARCH_INQUIRY_KAKAOTALK_LINK } from '@constants/url';
import { Button, Layout, SvgIcon, Typo } from '@design-system';

function ResearchIntro() {
  const [t] = useTranslation('translation', { keyPrefix: 'research_intro' });
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const handleClickSignUpForm = () => {
    navigate('/signup');
    // TODO: 출시되고 나면 위 navigate 삭제 & 이 부분 주석 해제 필요
    // window.open(RESEARCH_SIGNUP_FORM_URL, '_blank');
  };

  const handleClickSignIn = () => {
    navigate('/signin');
  };

  return (
    <MainContainer>
      <Layout.FlexCol mt={100} w="100%" h="100%" ph={25} alignItems="center">
        <Typo type="head-line" mb={50} textAlign="center">
          {t('title')}
        </Typo>
        <Typo type="title-medium">
          {t('description_before_bold')}
          <Typo type="title-medium" bold>
            {t('description_bold')}
          </Typo>
          {t('description_after_bold')}
        </Typo>
        <Layout.FlexCol w="100%" gap={30} ph={20} mt={50}>
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
        <Layout.FlexRow alignItems="center" gap={8} mt={20} onClick={() => setShowMore(!showMore)}>
          <Typo type="button-medium">{t('someting_else_title')}</Typo>
          {showMore ? (
            <SvgIcon name="chevron_up" size={20} color="BLACK" />
          ) : (
            <SvgIcon name="chevron_down" size={20} color="BLACK" />
          )}
        </Layout.FlexRow>
        {showMore && (
          <Layout.FlexCol w="100%" ph={20} mt={10}>
            <Typo type="body-medium">{t('someting_else_description')}</Typo>
            <Layout.FlexCol gap={12} mt={20}>
              <Layout.FlexRow alignItems="center" gap={8}>
                <span>📞</span>
                <Typo type="body-medium">
                  <a href="tel:+1-206-730-2178" target="_blank" rel="noopener noreferrer">
                    +1-206-730-2178 🇺🇸
                  </a>
                </Typo>
              </Layout.FlexRow>
              <Layout.FlexRow alignItems="center" gap={8}>
                <span>💬</span>
                <Typo type="body-medium">
                  <a
                    href={RESEARCH_INQUIRY_KAKAOTALK_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [Kakaotalk link] 🇰🇷
                  </a>
                </Typo>
              </Layout.FlexRow>
              <Layout.FlexRow alignItems="center" gap={8}>
                <span>📧</span>
                <Typo type="body-medium">
                  <a href="mailto:jaewonk@uw.edu" target="_blank" rel="noopener noreferrer">
                    jaewonk@uw.edu
                  </a>
                </Typo>
              </Layout.FlexRow>
            </Layout.FlexCol>
          </Layout.FlexCol>
        )}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default ResearchIntro;
