import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

function SignUp() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });
  const { resetSignUpInfo, setSignUpInfo } = useBoundStore((state) => ({
    resetSignUpInfo: state.resetSignUpInfo,
    setSignUpInfo: state.setSignUpInfo,
  }));
  const { pathname, search } = useLocation();
  const initializedRef = useRef(false);

  const title = useMemo(() => {
    if (pathname.includes('research')) return t('research_participation_consent_form');
    if (pathname.includes('profile-image')) return t('add_a_profile_image');
    return t('create_an_account');
  }, [pathname, t]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const params = new URLSearchParams(search);
    const invitedByPathMatch = pathname.match(/\/signup\/email\/invited-by\/([^/?#]+)/);
    const inviterUsername =
      (invitedByPathMatch?.[1] ? decodeURIComponent(invitedByPathMatch[1]) : null) ||
      params.get('inviter_username') ||
      params.get('inviter') ||
      params.get('invited_by');

    resetSignUpInfo();
    if (inviterUsername) {
      setSignUpInfo({ inviter_username: inviterUsername.trim() });
    }
  }, [pathname, resetSignUpInfo, search, setSignUpInfo]);

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
