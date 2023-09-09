import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Button, Font, Layout } from '@design-system';

interface ResponseCompleteModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  onSendQuestion?: () => void;
}

function ResponseCompleteModal({
  isVisible,
  setIsVisible,
  onSendQuestion,
}: ResponseCompleteModalProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'question.response' });

  const handleOnSendQuestion = () => {
    setIsVisible(false);
    onSendQuestion?.();
  };

  const handleOnClose = () => {
    setIsVisible(false);
  };

  return (
    <BottomModal visible={isVisible} onClose={handleOnClose}>
      <Layout.FlexCol w="100%" alignItems="center" bgColor="BASIC_WHITE" pt={80} pb={60}>
        <Font.Body type="18_regular">🥳</Font.Body>
        <Font.Body type="18_regular" mt={4}>
          {t('complete')}
        </Font.Body>
        <Font.Body type="18_regular" mb={22}>
          {t('send_question_to_friends_now')}
        </Font.Body>
        <Button.Medium
          type="filled"
          status="normal"
          text={t('send_question')}
          onClick={handleOnSendQuestion}
        />
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default ResponseCompleteModal;
