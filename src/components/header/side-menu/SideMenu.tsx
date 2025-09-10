import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Z_INDEX } from '@constants/layout';
import {
  DAILY_SURVEY_URL_EN,
  DAILY_SURVEY_URL_KO,
  ONBOARDING_VIDEO_URL,
  QUESTION_SUGGEST_URL_EN,
  QUESTION_SUGGEST_URL_KO,
  RESEARCH_INQUIRY_DISCORD_LINK,
  RESEARCH_INQUIRY_INSTAGRAM_LINK,
  RESEARCH_INQUIRY_KAKAOTALK_LINK,
} from '@constants/url';
import { Layout, SvgIcon, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { UserGroup } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';

const SIDE_MENU_LIST = [
  { key: 'explore_friends', path: '/friends/explore' },
  // { key: 'questions', path: '/questions' },
  { key: 'settings', path: '/settings' },
];

interface Props {
  closeSideMenu: () => void;
}

// TODO: Add entrance/exit animations
function SideMenu({ closeSideMenu }: Props) {
  const [t, i18n] = useTranslation('translation', { keyPrefix: 'home.header.side_menu' });
  const navigate = useNavigate();
  const postMessage = usePostAppMessage();

  const { myProfile } = useBoundStore((state) => ({
    myProfile: state.myProfile,
  }));

  const isUSParticipant =
    myProfile?.user_group === UserGroup.GROUP_1 || myProfile?.user_group === UserGroup.GROUP_2;

  const handleClickMenu = (path: string) => () => {
    navigate(path);
  };

  const handleClickDimmed = () => {
    closeSideMenu();
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
    } else {
      window.open('sms:+1-206-730-2178', '_blank');
    }
  };

  const handleClickQuestionSuggest = () => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_BROWSER', {
        url: isUSParticipant ? QUESTION_SUGGEST_URL_EN : QUESTION_SUGGEST_URL_KO,
      });
    } else {
      window.open(isUSParticipant ? QUESTION_SUGGEST_URL_EN : QUESTION_SUGGEST_URL_KO, '_blank');
    }
  };

  const handleClickOnboardingVideo = () => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_BROWSER', {
        url: ONBOARDING_VIDEO_URL,
      });
    } else {
      window.open(ONBOARDING_VIDEO_URL, '_blank');
    }
  };

  const handleClickDailySurvery = () => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_BROWSER', {
        url: isUSParticipant ? DAILY_SURVEY_URL_EN : DAILY_SURVEY_URL_KO,
      });
    } else {
      window.open(isUSParticipant ? DAILY_SURVEY_URL_EN : DAILY_SURVEY_URL_KO, '_blank');
    }
  };

  return createPortal(
    <Layout.Absolute t={0} l={0} r={0} b={0} z={Z_INDEX.MODAL_CONTAINER}>
      <Layout.Absolute w="100%" h="100%" bgColor="DIM" onClick={handleClickDimmed} />
      <Layout.Absolute r={0} w={250} h="100%" bgColor="WHITE">
        <Layout.FlexCol pt={56} pl={24}>
          <SvgIcon name="close" color="BLACK" size={24} onClick={handleClickDimmed} />
          <Layout.FlexCol gap={12} pt={30}>
            {SIDE_MENU_LIST.map((menu) => (
              <button type="button" key={menu.key} onClick={handleClickMenu(menu.path)}>
                <Typo type="head-line">{t(menu.key)}</Typo>
              </button>
            ))}
            <Layout.FlexCol mt={52}>
              <a
                href={isUSParticipant ? QUESTION_SUGGEST_URL_EN : QUESTION_SUGGEST_URL_KO}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  handleClickQuestionSuggest();
                }}
              >
                <Typo type="title-large" color="BLACK">
                  ❓{' '}
                </Typo>
                <Typo type="title-large" color="BLACK" underline>
                  {t('question_suggest')}
                </Typo>
              </a>
            </Layout.FlexCol>
            <Layout.FlexCol>
              <a
                href={isUSParticipant ? DAILY_SURVEY_URL_EN : DAILY_SURVEY_URL_KO}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  handleClickDailySurvery();
                }}
              >
                <Layout.FlexRow gap={4}>
                  <Typo type="title-large" color="BLACK">
                    📝{' '}
                  </Typo>
                  <Typo type="title-large" color="BLACK" underline>
                    {t('feedback_to_researcher')}
                  </Typo>
                </Layout.FlexRow>
              </a>
            </Layout.FlexCol>
            <Layout.FlexCol>
              <a
                href={ONBOARDING_VIDEO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  handleClickOnboardingVideo();
                }}
              >
                <Typo type="title-large" color="BLACK">
                  📺{' '}
                </Typo>
                <Typo type="title-large" color="BLACK" underline>
                  {t('onboarding_video')}
                </Typo>
              </a>
            </Layout.FlexCol>

            {/* Inquiry & Contact */}
            <Layout.FlexCol mt={52} pr={12}>
              <Typo type="title-large" mb={20}>
                {t('inquiry')} :
              </Typo>
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
                    <Typo type="title-medium">
                      💬{' '}
                      <Typo type="title-medium" bold underline>
                        {t('kakao_inquiry')}
                      </Typo>
                    </Typo>
                  </a>
                  <Typo type="title-medium">
                    🎮{' '}
                    <Typo type="title-medium" bold>
                      {t('discord_inquiry')} :{' '}
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
                      <Typo type="title-medium" underline>
                        @jaewonkim___
                      </Typo>
                    </a>
                    <Typo type="title-medium"> (밑줄 3개)</Typo>
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
                    <Typo type="title-medium">
                      📸{' '}
                      <Typo type="title-medium" bold>
                        {t('instagram_inquiry')}
                      </Typo>
                      <Typo type="title-medium" underline>
                        @whoami.today.official
                      </Typo>
                    </Typo>
                  </a>
                </Layout.FlexCol>
              ) : (
                <Layout.FlexCol gap={15} pl={4}>
                  <Typo type="title-medium">
                    🎮{' '}
                    <Typo type="title-medium" bold>
                      {t('discord_inquiry')} :{' '}
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
                      <Typo type="title-medium" underline>
                        @jaewonkim___
                      </Typo>
                    </a>
                    <Typo type="title-medium"> (three underscores)</Typo>
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
                    <Typo type="title-medium">
                      📱{' '}
                      <Typo type="title-medium" bold>
                        {t('text_message_inquiry')} :{' '}
                      </Typo>
                      <Typo type="title-medium" underline>
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
                    <Typo type="title-medium">
                      📸{' '}
                      <Typo type="title-medium" bold>
                        {t('instagram_inquiry')} :{' '}
                      </Typo>
                      <Typo type="title-medium" underline>
                        @whoami.today.official
                      </Typo>
                    </Typo>
                  </a>
                </Layout.FlexCol>
              )}
            </Layout.FlexCol>
          </Layout.FlexCol>
        </Layout.FlexCol>
      </Layout.Absolute>
    </Layout.Absolute>,
    document.getElementById('root-container') || document.body,
  );
}

export default SideMenu;
