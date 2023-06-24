import { useTranslation } from 'react-i18next';
import { Divider } from '@components/_common/divider/Divider.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import UserProfile from '@components/_common/user-profile/UserProfile';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Font, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

function EditProfile() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings' });
  const myProfile = useBoundStore((state) => state.myProfile);

  const handleClickUpdate = () => console.log('todo: click update');

  // TODO: 프로필 없을 때 처리
  if (!myProfile) return null;

  const { username, email, profile_image } = myProfile;
  return (
    <MainContainer>
      <TitleHeader title={t('edit_profile')} type="SUB" />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%" gap={10}>
        <Layout.FlexCol pt={12} pb={19} bgColor="GRAY_10" w="100%" alignItems="center">
          <UserProfile imageUrl={profile_image} username={username} size={124} />
          <Font.Display type="14_regular">{t('change_picture')}</Font.Display>
        </Layout.FlexCol>
      </Layout.FlexCol>
      <Layout.FlexCol pt={32} pl={24} pr={24} gap={24} w="100%">
        <Font.Display type="14_regular">{t('username')}</Font.Display>
        <Font.Body type="18_regular">{username}</Font.Body>
        <Divider width={1} />
        <Font.Display type="14_regular">{t('email')}</Font.Display>
        <Font.Body type="18_regular">{email}</Font.Body>
      </Layout.FlexCol>
      <Layout.Absolute w="100%" b="50px" pl={24} pr={24} flexDirection="column">
        <Button.Large
          type="filled"
          status="disabled"
          sizing="stretch"
          text={t('update')}
          onClick={handleClickUpdate}
        />
      </Layout.Absolute>
    </MainContainer>
  );
}

export default EditProfile;
