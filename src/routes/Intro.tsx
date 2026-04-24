import { useTranslation } from 'react-i18next';
import { Navigate, useLoaderData } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import { Button, Layout } from '@design-system';
import { MyProfile, VersionType } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';

function Intro() {
  const [t] = useTranslation('translation', { keyPrefix: 'intro' });
  const data = useLoaderData() as MyProfile | null;

  const { myProfile } = useBoundStore((state) => ({
    myProfile: state.myProfile,
  }));

  if (data) {
    // Use current_ver from data or myProfile to determine redirect path
    const currentVer = data.current_ver || myProfile?.current_ver;
    const targetPath = currentVer === VersionType.VER_Q ? '/friends-q' : '/friends';
    return <Navigate to={targetPath} replace />;
  }
  return (
    <MainContainer>
      <Layout.FlexCol w="100%" h="100%" justifyContent="center" alignItems="center" mb={100}>
        <img src="/whoami-logo.svg" alt="who_am_i" />
      </Layout.FlexCol>
      <Layout.Absolute w="100%" b="0" flexDirection="column" p={24} mb={56} gap={24}>
        <Button.Large
          type="gray_fill"
          status="normal"
          to="/signup/email"
          text={t('sign_up')}
          sizing="stretch"
        />
        <Button.Large
          type="gray_fill"
          status="normal"
          to="/signin"
          text={t('sign_in')}
          sizing="stretch"
        />
      </Layout.Absolute>
    </MainContainer>
  );
}

export default Intro;
