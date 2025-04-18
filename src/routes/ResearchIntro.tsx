import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  RESEARCH_INQUIRY_DISCORD_LINK,
  RESEARCH_INQUIRY_INSTAGRAM_LINK,
  RESEARCH_INQUIRY_KAKAOTALK_LINK,
} from '@constants/url';
import { Button, Layout, SvgIcon, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { MainScrollContainer } from './Root';

function ResearchIntro() {
  const [t, i18n] = useTranslation('translation', { keyPrefix: 'research_intro' });
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const postMessage = usePostAppMessage();

  const handleClickSignUpForm = () => {
    // window.open(
    //   i18n.language === 'ko-KR' ? RESEARCH_SIGNUP_FORM_URL_KO : RESEARCH_SIGNUP_FORM_URL_EN,
    //   '_blank',
    // );
    navigate('/signup');
  };

  const handleClickSignIn = () => {
    navigate('/signin');
  };

  const handleClickKakaoInquiry = () => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_BROWSER', {
        url: RESEARCH_INQUIRY_KAKAOTALK_LINK,
      });
    } else {
      window.open(RESEARCH_INQUIRY_KAKAOTALK_LINK, '_blank');
    }
  };

  const handleClickDiscordLink = () => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_BROWSER', {
        url: RESEARCH_INQUIRY_DISCORD_LINK,
      });
    } else {
      window.open(RESEARCH_INQUIRY_DISCORD_LINK, '_blank');
    }
  };

  const handleClickInstagramLink = () => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_BROWSER', {
        url: RESEARCH_INQUIRY_INSTAGRAM_LINK,
      });
    } else {
      window.open(RESEARCH_INQUIRY_INSTAGRAM_LINK, '_blank');
    }
  };

  const handleClickTextMessageInquiry = () => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_BROWSER', {
        url: 'sms:+1-206-730-2178',
      });
    }
  };

  return (
    <MainScrollContainer>
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
              {i18n.language === 'ko-KR' ? (
                <Layout.FlexCol gap={15} pl={4}>
                  <a
                    href={RESEARCH_INQUIRY_KAKAOTALK_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClickKakaoInquiry();
                    }}
                  >
                    <Typo type="body-medium">
                      💬{' '}
                      <Typo type="body-medium" bold underline>
                        {t('kakao')}
                      </Typo>
                    </Typo>
                  </a>
                  <Typo type="body-medium">
                    🎮{' '}
                    <Typo type="body-medium" bold>
                      {t('discord')} :{' '}
                    </Typo>
                    <a
                      href={RESEARCH_INQUIRY_DISCORD_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClickDiscordLink();
                      }}
                    >
                      <Typo type="body-medium" underline>
                        @jaewonkim___
                      </Typo>
                    </a>
                    <Typo type="body-medium"> (밑줄 3개)</Typo>
                  </Typo>
                  <a
                    href={RESEARCH_INQUIRY_INSTAGRAM_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClickInstagramLink();
                    }}
                  >
                    <Typo type="body-medium">
                      📸{' '}
                      <Typo type="body-medium" bold>
                        {t('instagram')} :{' '}
                      </Typo>
                      <Typo type="body-medium" underline>
                        @whoami.today.official
                      </Typo>
                    </Typo>
                  </a>
                  <Layout.FlexRow alignItems="center" gap={8}>
                    📧
                    <Typo type="body-medium">
                      <Typo type="body-medium" bold>
                        {t('email')} :{' '}
                      </Typo>
                      <a href="mailto:jaewonk@uw.edu" target="_blank" rel="noopener noreferrer">
                        jaewonk@uw.edu
                      </a>
                    </Typo>
                  </Layout.FlexRow>
                </Layout.FlexCol>
              ) : (
                <Layout.FlexCol gap={15} pl={4}>
                  <Typo type="body-medium">
                    🎮{' '}
                    <Typo type="body-medium" bold>
                      {t('discord')} :{' '}
                    </Typo>
                    <a
                      href={RESEARCH_INQUIRY_DISCORD_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (window.ReactNativeWebView) {
                          e.preventDefault();
                          handleClickDiscordLink();
                        }
                      }}
                    >
                      <Typo type="body-medium" underline>
                        @jaewonkim___
                      </Typo>
                    </a>
                    <Typo type="body-medium"> (three underscores)</Typo>
                  </Typo>
                  <a
                    href="sms:+1-206-730-2178"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (window.ReactNativeWebView) {
                        e.preventDefault();
                        handleClickTextMessageInquiry();
                      }
                    }}
                  >
                    <Typo type="body-medium">
                      📱{' '}
                      <Typo type="body-medium" bold>
                        {t('text_message')} :{' '}
                      </Typo>
                      <Typo type="body-medium" underline>
                        +1-206-730-2178
                      </Typo>
                    </Typo>
                  </a>
                  <a
                    href={RESEARCH_INQUIRY_INSTAGRAM_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClickInstagramLink();
                    }}
                  >
                    <Typo type="body-medium">
                      📸{' '}
                      <Typo type="body-medium" bold>
                        {t('instagram')} :{' '}
                      </Typo>
                      <Typo type="body-medium" underline>
                        @whoami.today.official
                      </Typo>
                    </Typo>
                  </a>
                  <Layout.FlexRow alignItems="center" gap={8}>
                    <span>📧</span>
                    <Typo type="body-medium">
                      <Typo type="body-medium" bold>
                        {t('email')} :{' '}
                      </Typo>
                      <a href="mailto:jaewonk@uw.edu" target="_blank" rel="noopener noreferrer">
                        jaewonk@uw.edu
                      </a>
                    </Typo>
                  </Layout.FlexRow>
                </Layout.FlexCol>
              )}
            </Layout.FlexCol>
          </Layout.FlexCol>
        )}
      </Layout.FlexCol>
    </MainScrollContainer>
  );
}

export default ResearchIntro;
