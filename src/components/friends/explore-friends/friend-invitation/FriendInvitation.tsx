import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToastMessage from '@components/_common/toast-message/ToastMessage';
import { Font, Layout, SvgIcon, Typo } from '@design-system';
import i18n from '@i18n/index';
import { getMobileDeviceInfo } from '@utils/getUserAgent';

const INVITATION_LINK = 'https://whoamitoday.page.link/invite';

export default function FriendInvitation() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.friends.invite' });
  const { isMobile } = getMobileDeviceInfo();
  const [showToast, setShowToast] = useState(false);

  const handleClickLinkShare = () => {
    if (!isMobile || !navigator.share) {
      navigator.clipboard.writeText(INVITATION_LINK);
      setShowToast(true);
      return;
    }
    navigator.share({
      title: i18n.t('settings.friends.invite.title') ?? '',
      text: i18n.t('settings.friends.invite.text') ?? '',
      url: INVITATION_LINK,
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
        <Layout.FlexCol>
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
