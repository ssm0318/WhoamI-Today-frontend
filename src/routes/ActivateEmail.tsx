import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import axios from '@utils/apis/axios';

function ActivateEmail() {
  const [t] = useTranslation('translation', { keyPrefix: 'email_verification_complete' });
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!uidb64 || !token) {
        setStatus('error');
        setErrorMessage('Invalid verification link');
        return;
      }

      try {
        await axios.put(`/user/activate/${uidb64}/${token}/`);
        setStatus('success');
      } catch (error) {
        setStatus('error');
        setErrorMessage('Email verification failed. The link may be expired or invalid.');
      }
    };

    verifyEmail();
  }, [uidb64, token]);

  if (status === 'loading') {
    return (
      <Layout.FlexCol w="100%">
        <SubHeader title="Email Verification" LeftComponent={<Layout.LayoutBase w={36} h={36} />} />
        <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 40} w="100%" ph={24} alignItems="center" gap={20}>
          <Typo type="title-large">Verifying your email...</Typo>
        </Layout.FlexCol>
      </Layout.FlexCol>
    );
  }

  if (status === 'error') {
    return (
      <Layout.FlexCol w="100%">
        <SubHeader title="Email Verification" LeftComponent={<Layout.LayoutBase w={36} h={36} />} />
        <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 40} w="100%" ph={24} alignItems="center" gap={20}>
          <Layout.FlexCol alignItems="center" gap={12}>
            <Typo type="title-large">Verification Failed</Typo>
            <Typo type="body-large" color="MEDIUM_GRAY" textAlign="center">
              {errorMessage}
            </Typo>
          </Layout.FlexCol>
        </Layout.FlexCol>
      </Layout.FlexCol>
    );
  }

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

export default ActivateEmail;
