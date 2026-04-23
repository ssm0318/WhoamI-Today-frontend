import { MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import MyCheckInCard from '@components/check-in/my-check-in-card/MyCheckInCard';
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
import { useBoundStore } from '@stores/useBoundStore';

const SIDE_MENU_LIST = [{ key: 'settings', path: '/settings' }];

interface Props {
  closeSideMenu: () => void;
}

// TODO: Add entrance/exit animations
function SideMenu({ closeSideMenu }: Props) {
  const [t, i18n] = useTranslation('translation', { keyPrefix: 'home.header.side_menu' });
  const navigate = useNavigate();
  const postMessage = usePostAppMessage();
  const myProfile = useBoundStore((state) => state.myProfile);

  const isUSParticipant = true;

  const handleClickMenu = (path: string) => () => {
    navigate(path);
  };

  const handleClickDimmed = () => {
    closeSideMenu();
  };

  const handleCardInteract = () => {
    closeSideMenu();
  };

  const handleClickEditProfile = (e: MouseEvent) => {
    e.stopPropagation();
    closeSideMenu();
    navigate('/settings/edit-profile');
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
        <Layout.FlexCol pt={20} pl={24}>
          <SvgIcon name="close" color="BLACK" size={24} onClick={handleClickDimmed} />
          {myProfile && (
            <Layout.FlexCol pt={16} pr={8} gap={8}>
              <div onClick={handleCardInteract} role="presentation" style={{ cursor: 'pointer' }}>
                <MyCheckInCard />
              </div>
              <Layout.FlexRow
                gap={2}
                alignItems="center"
                onClick={handleClickEditProfile}
                style={{ cursor: 'pointer', paddingLeft: 4 }}
              >
                <SvgIcon name="edit_filled" fill="DARK_GRAY" size={12} />
                <Typo type="label-medium" color="DARK_GRAY" underline>
                  {t('edit_profile')}
                </Typo>
              </Layout.FlexRow>
            </Layout.FlexCol>
          )}
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
                <Layout.FlexRow gap={4} alignItems="center">
                  <EmojiItem
                    emojiString="❓"
                    size={20}
                    bgColor="TRANSPARENT"
                    outline="TRANSPARENT"
                  />
                  <Typo type="title-large" color="BLACK" underline>
                    {t('question_suggest')}
                  </Typo>
                </Layout.FlexRow>
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
                <Layout.FlexRow gap={4} alignItems="center">
                  <EmojiItem
                    emojiString="📝"
                    size={20}
                    bgColor="TRANSPARENT"
                    outline="TRANSPARENT"
                  />
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
                <Layout.FlexRow gap={4} alignItems="center">
                  <EmojiItem
                    emojiString="📺"
                    size={20}
                    bgColor="TRANSPARENT"
                    outline="TRANSPARENT"
                  />
                  <Typo type="title-large" color="BLACK" underline>
                    {t('onboarding_video')}
                  </Typo>
                </Layout.FlexRow>
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
                    <Layout.FlexRow gap={4} alignItems="center">
                      <EmojiItem
                        emojiString="💬"
                        size={18}
                        bgColor="TRANSPARENT"
                        outline="TRANSPARENT"
                      />
                      <Typo type="title-medium" bold underline>
                        {t('kakao_inquiry')}
                      </Typo>
                    </Layout.FlexRow>
                  </a>
                  <Layout.FlexRow gap={4} alignItems="flex-start" style={{ flexWrap: 'wrap' }}>
                    <EmojiItem
                      emojiString="🎮"
                      size={18}
                      bgColor="TRANSPARENT"
                      outline="TRANSPARENT"
                    />
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
                  </Layout.FlexRow>
                  <a
                    href={RESEARCH_INQUIRY_INSTAGRAM_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClickInstagramLink();
                    }}
                  >
                    <Layout.FlexRow gap={4} alignItems="flex-start">
                      <EmojiItem
                        emojiString="📸"
                        size={18}
                        bgColor="TRANSPARENT"
                        outline="TRANSPARENT"
                      />
                      <Typo type="title-medium">
                        <b>{`${t('instagram_inquiry')} `}</b>
                        <u>@whoami.today.official</u>
                      </Typo>
                    </Layout.FlexRow>
                  </a>
                </Layout.FlexCol>
              ) : (
                <Layout.FlexCol gap={15} pl={4}>
                  <Layout.FlexRow gap={4} alignItems="flex-start" style={{ flexWrap: 'wrap' }}>
                    <EmojiItem
                      emojiString="🎮"
                      size={18}
                      bgColor="TRANSPARENT"
                      outline="TRANSPARENT"
                    />
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
                  </Layout.FlexRow>
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
                    <Layout.FlexRow gap={4} alignItems="flex-start">
                      <EmojiItem
                        emojiString="📱"
                        size={18}
                        bgColor="TRANSPARENT"
                        outline="TRANSPARENT"
                      />
                      <Typo type="title-medium">
                        <b>{t('text_message_inquiry')} : </b>
                        <u>+1-206-730-2178</u>
                      </Typo>
                    </Layout.FlexRow>
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
                    <Layout.FlexRow gap={4} alignItems="flex-start">
                      <EmojiItem
                        emojiString="📸"
                        size={18}
                        bgColor="TRANSPARENT"
                        outline="TRANSPARENT"
                      />
                      <Typo type="title-medium">
                        <b>{t('instagram_inquiry')} : </b>
                        <u>@whoami.today.official</u>
                      </Typo>
                    </Layout.FlexRow>
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
