import { useTranslation } from 'react-i18next';
import { Divider } from '@components/_common/divider/Divider.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Font, Layout, SvgIcon } from '@design-system';

function EditProfile() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings' });

  const handleClickUpdate = () => console.log('todo: click update');

  return (
    <MainContainer>
      <TitleHeader title={t('edit_profile')} type="SUB" />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%" gap={10}>
        <Layout.FlexCol pt={12} pb={19} bgColor="GRAY_10" w="100%" alignItems="center">
          <SvgIcon name="my_profile" size={124} />
          <Font.Display type="14_regular">{t('change_picture')}</Font.Display>
        </Layout.FlexCol>
      </Layout.FlexCol>
      <Layout.FlexCol pt={32} ph={24} gap={24} w="100%">
        <Font.Display type="14_regular">{t('username')}</Font.Display>
        <Font.Body type="18_regular">KNKN</Font.Body>
        <Divider width={1} />
        <Font.Display type="14_regular">{t('email')}</Font.Display>
        <Font.Body type="18_regular">whoamitoday@gmail.com</Font.Body>
      </Layout.FlexCol>
      <Layout.Absolute w="100%" b="50px" ph={24} flexDirection="column">
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
