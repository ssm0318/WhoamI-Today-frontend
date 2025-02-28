import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToastMessage from '@components/_common/toast-message/ToastMessage';
import { INVITATION_LINK } from '@constants/url';
import { Font, Layout, SvgIcon, Typo } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import { decodeHTMLEntities } from '@utils/urlHelpers';

export default function FriendInvitation() {
  const myProfile = useBoundStore((state) => state.myProfile);

  const [t] = useTranslation('translation', { keyPrefix: 'friends.explore_friends.invite' });
  const { isMobile } = getMobileDeviceInfo();
  const [showToast, setShowToast] = useState(false);

  const handleClickLinkShare = () => {
    // desktop 에서는 클립보드에 복사
    if (!isMobile || !navigator.share) {
      const message = decodeHTMLEntities(
        t('desktop_message', {
          username: myProfile?.username,
          invitation_link: INVITATION_LINK,
        }),
      );
      navigator.clipboard.writeText(message);
      setShowToast(true);
      return;
    }

    // mobile 에서는 공유하기
    // webview의 경우는 title이 포함된 message를 보내야 함
    const message = window.ReactNativeWebView
      ? decodeHTMLEntities(
          `${t('mobile_message_title')}\n\n${t('mobile_message', {
            username: myProfile?.username,
            invitation_link: INVITATION_LINK,
          })}`,
        )
      : decodeHTMLEntities(
          t('mobile_message', {
            username: myProfile?.username,
            invitation_link: INVITATION_LINK,
          }),
        );

    navigator.share({
      title: t('mobile_message_title') || '',
      text: message,
    });
  };

  return (
    <>
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        bgColor="INPUT_GRAY"
        rounded={12}
        gap={13}
        ph={11}
        pv={8}
        onClick={handleClickLinkShare}
      >
        <SvgIcon name="my_profile" size={36} />
        <Layout.FlexCol w="100%">
          {/* FIXME: 디자인 시스템에 대응되는 폰트 없음 */}
          <Font.Body type="14_semibold" color="MEDIUM_GRAY">
            {t('text')}
          </Font.Body>
          <Typo type="body-medium" color="MEDIUM_GRAY">
            {INVITATION_LINK}
          </Typo>
        </Layout.FlexCol>
        <SvgIcon name="share_default" size={44} />
      </Layout.FlexRow>
      {showToast && <ToastMessage text={t('copy')} closeToastMessage={() => setShowToast(false)} />}
    </>
  );
}
