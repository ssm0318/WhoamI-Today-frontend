import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Z_INDEX } from '@constants/layout';
import {
  RESEARCH_INQUIRY_DISCORD_LINK,
  RESEARCH_INQUIRY_INSTAGRAM_LINK,
  RESEARCH_INQUIRY_KAKAOTALK_LINK,
} from '@constants/url';
import { Layout, SvgIcon, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import i18n from '@i18n/index';

const SIDE_MENU_LIST = [
  { key: 'explore_friends', path: '/friends/explore' },
  // { key: 'questions', path: '/questions' },
  { key: 'settings', path: '/settings' },
];

interface Props {
  closeSideMenu: () => void;
}

// TODO: 등장/퇴장 애니메이션 추가
function SideMenu({ closeSideMenu }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'home.header.side_menu' });
  const navigate = useNavigate();
  const postMessage = usePostAppMessage();

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
            {/* 문의 * 연락처 */}
            <Layout.FlexCol mt={40} pr={12}>
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
