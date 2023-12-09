import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToastMessage from '@components/_common/toast-message/ToastMessage';
import { Font, Layout, SvgIcon } from '@design-system';
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
    <Layout.LayoutBase w="100%" ph={16}>
      <Layout.FlexRow
        w="100%"
        alignItems="center"
        justifyContent="space-evenly"
        bgColor="GRAY_10"
        rounded={12}
        gap={13}
        ph={11}
        pv={10}
        onClick={handleClickLinkShare}
      >
        <Layout.FlexRow w="100%" gap={13} alignItems="center">
          <SvgIcon name="my_profile" size={27} />
          <Layout.FlexCol>
            <Font.Body type="14_semibold" color="MEDIUM_GRAY">
              {t('text')}
            </Font.Body>
            <Font.Body type="14_regular" color="MEDIUM_GRAY">
              {INVITATION_LINK}
            </Font.Body>
          </Layout.FlexCol>
        </Layout.FlexRow>
        <SvgIcon name="share_default" size={26} />
      </Layout.FlexRow>
      {showToast && <ToastMessage text={t('copy')} closeToastMessage={() => setShowToast(false)} />}
    </Layout.LayoutBase>
  );
}
