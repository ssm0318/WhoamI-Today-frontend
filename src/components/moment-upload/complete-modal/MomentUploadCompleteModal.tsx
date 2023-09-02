import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Button, Font, Layout } from '@design-system';

interface MomentUploadCompleteModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

function MomentUploadCompleteModal({ isVisible, setIsVisible }: MomentUploadCompleteModalProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'moment_upload' });
  const navigate = useNavigate();

  const handleOnViewFriend = () => {
    setIsVisible(false);
    navigate('/friends');
  };

  const handleOnClose = () => {
    navigate('/home');
  };

  return (
    <BottomModal visible={isVisible} onClose={handleOnClose}>
      <Layout.FlexCol w="100%" alignItems="center" bgColor="BASIC_WHITE" pt={80} pb={60} gap={16}>
        <Font.Body type="18_regular">🎉</Font.Body>
        <Font.Body type="18_regular" mt={4}>
          {t('post_complete')}
        </Font.Body>
        <Button.Medium
          type="filled"
          status="normal"
          text={t('view_friends_moment')}
          onClick={handleOnViewFriend}
        />
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default MomentUploadCompleteModal;
