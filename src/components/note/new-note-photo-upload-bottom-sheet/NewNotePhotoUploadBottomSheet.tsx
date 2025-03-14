import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Divider from '@components/_common/divider/Divider';
import Icon from '@components/_common/icon/Icon';
import { Layout, Typo } from '@design-system';

interface Props {
  visible: boolean;
  onClickOpenCamera: () => void;
  onClickOpenAlbum: () => void;
  closeBottomSheet: () => void;
}

function NewNotePhotoUploadBottomSheet({
  visible,
  closeBottomSheet,
  onClickOpenCamera,
  onClickOpenAlbum,
}: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'notes.photo_upload_bottom_sheet' });

  const handleClickOpenCamera = () => {
    onClickOpenCamera();
    closeBottomSheet();
  };

  const handleClickOpenGallery = () => {
    onClickOpenAlbum();
    closeBottomSheet();
  };

  return (
    <BottomModal visible={visible} onClose={closeBottomSheet}>
      <Layout.FlexCol alignItems="center" pb={34} w="100%" bgColor="WHITE">
        <Icon name="home_indicator" />
        <Typo type="title-large" mb={12}>
          {t('title')}
        </Typo>
        <Divider width={1} />
        <Layout.FlexCol gap={12} p={24} w="100%">
          <>
            <button type="button" onClick={handleClickOpenGallery}>
              <Layout.FlexRow alignItems="center" justifyContent="center" w="100%">
                <Typo type="title-medium">{t('album')}</Typo>
              </Layout.FlexRow>
            </button>
            <Divider width={1} />
            <button type="button" onClick={handleClickOpenCamera}>
              <Layout.FlexRow alignItems="center" justifyContent="center" w="100%">
                <Typo type="title-medium">{t('camera')}</Typo>
              </Layout.FlexRow>
            </button>
          </>
        </Layout.FlexCol>
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default NewNotePhotoUploadBottomSheet;
