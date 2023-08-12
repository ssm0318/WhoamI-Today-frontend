import { useTranslation } from 'react-i18next';
import { Font, Layout, SvgIcon } from '@design-system';
import i18n from '@i18n/index';

const INVITATION_LINK = 'https://whoamitoday.page.link/invite';

export default function FriendInvitation() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.friends.invite' });

  const handleClickLinkShare = () => {
    if (!navigator.share) {
      navigator.clipboard.writeText(INVITATION_LINK);
      return;
    }
    navigator.share({
      title: i18n.t('settings.friends.invite.title') ?? '',
      text: i18n.t('settings.friends.invite.text') ?? '',
      url: INVITATION_LINK,
    });
  };

  return (
    <Layout.LayoutBase w="100%" ph={24}>
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
            <Font.Body type="14_semibold" color="GRAY_12">
              {t('text')}
            </Font.Body>
            <Font.Body type="14_regular" color="GRAY_12">
              {INVITATION_LINK}
            </Font.Body>
          </Layout.FlexCol>
        </Layout.FlexRow>
        <SvgIcon name="link_share" size={26} />
      </Layout.FlexRow>
    </Layout.LayoutBase>
  );
}
