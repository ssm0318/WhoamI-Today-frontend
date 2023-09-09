import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Button, Font, Layout } from '@design-system';

interface SendQuestionCompleteModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

function SendQuestionCompleteModal({ isVisible, setIsVisible }: SendQuestionCompleteModalProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'question' });

  const navigate = useNavigate();

  const handleOnViewAllQuestions = () => {
    setIsVisible(false);
    navigate('/questions');
  };

  const handleOnClose = () => {
    setIsVisible(false);
  };

  return (
    <BottomModal visible={isVisible} onClose={handleOnClose}>
      <Layout.FlexCol w="100%" alignItems="center" bgColor="BASIC_WHITE" pt={80} pb={60} gap={16}>
        <Font.Body type="18_regular">🎉</Font.Body>
        <Font.Body type="18_regular" mt={4}>
          {t('send.complete')}
        </Font.Body>
        <Button.Medium
          type="filled"
          status="normal"
          text={t('send.view_all_questions')}
          onClick={handleOnViewAllQuestions}
        />
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default SendQuestionCompleteModal;
