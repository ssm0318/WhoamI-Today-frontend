import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

function SignUp() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });
  const { resetSignUpInfo } = useBoundStore((state) => ({
    resetSignUpInfo: state.resetSignUpInfo,
  }));
  const { pathname } = useLocation();

  const title = useMemo(() => {
    if (pathname.includes('research')) return t('research_participation_consent_form');
    if (pathname.includes('profile-image')) return t('add_a_profile_image');
    return t('create_an_account');
  }, [pathname, t]);

  useEffect(() => {
    resetSignUpInfo();
  }, [resetSignUpInfo]);

  return (
    <>
      <SubHeader title={title} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 20} w="100%" ph={24} alignItems="center">
        <Outlet />
      </Layout.FlexCol>
    </>
  );
}

export default SignUp;
