import { useTranslation } from 'react-i18next';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';

function EmailVerificationComplete() {
  const [t] = useTranslation('translation', { keyPrefix: 'email_verification_complete' });

  return (
    <Layout.FlexCol w="100%">
      <SubHeader title={t('title')} LeftComponent={<Layout.LayoutBase w={36} h={36} />} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 40} w="100%" ph={24} alignItems="center" gap={20}>
        <Layout.FlexCol alignItems="center" gap={12}>
          <Typo type="title-large">{t('success_message')}</Typo>
          <Typo type="body-large" color="MEDIUM_GRAY" textAlign="center">
            {t('description')}
          </Typo>
        </Layout.FlexCol>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default EmailVerificationComplete;
