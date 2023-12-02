import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Button, Font, Layout } from '@design-system';

interface SendQuestionCompleteModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  onComplete?: () => void;
}

function SendQuestionCompleteModal({
  isVisible,
  setIsVisible,
  onComplete,
}: SendQuestionCompleteModalProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'question.send' });

  const handleConfirm = () => {
    setIsVisible(false);
    onComplete?.();
  };

  const handleOnClose = () => {
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible) return null;
  return (
    <BottomModal visible={isVisible} onClose={handleOnClose}>
      <Layout.FlexCol w="100%" alignItems="center" bgColor="WHITE" pt={80} pb={60} gap={16}>
        <Font.Body type="18_regular">🎉</Font.Body>
        <Font.Body type="18_regular" mt={4}>
          {t('complete')}
        </Font.Body>
        <Button.Medium type="filled" status="normal" text={t('ok')} onClick={handleConfirm} />
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default SendQuestionCompleteModal;
