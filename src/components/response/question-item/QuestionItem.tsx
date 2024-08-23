import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SendPromptModal from '@components/_common/prompt/SendPromptModal';
import { Layout, Typo } from '@design-system';
import { DailyQuestion } from '@models/post';
import { QuestionItemWrapper } from './QuestionItem.styled';

interface QuestionItemProps {
  question: DailyQuestion;
  onSend?: () => void;
}

function QuestionItem({ question, onSend }: QuestionItemProps) {
  const navigate = useNavigate();
  const { id, content } = question;

  const [sendPromptModalVisible, setSendPromptBottomModalVisible] = useState(false);
  const handleClickRespond = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/questions/${id}/new`);
  };

  const handleClickSend = (e: MouseEvent) => {
    e.stopPropagation();
    onSend?.();
    setSendPromptBottomModalVisible(true);
  };

  const onCloseSendBottomModal = () => {
    setSendPromptBottomModalVisible(false);
  };

  return (
    <>
      <QuestionItemWrapper p={16} rounded={12} w="100%">
        <Layout.FlexRow gap={8} alignItems="center">
          <ProfileImage imageUrl="/whoami-profile.svg" username="Whoami Today" size={28} />
          <Typo type="title-medium">Whoami Today</Typo>
        </Layout.FlexRow>
        <Typo type="body-large" mt={14}>
          {content}
        </Typo>
        <Layout.FlexRow w="100%" alignItems="center" justifyContent="flex-end" gap={18} mt={4}>
          <Icon name="question_respond" size={22} onClick={handleClickRespond} />
          <Icon name="question_send" size={22} onClick={handleClickSend} />
        </Layout.FlexRow>
      </QuestionItemWrapper>
      {sendPromptModalVisible && (
        <SendPromptModal
          visible={sendPromptModalVisible}
          onClose={onCloseSendBottomModal}
          questionId={question.id}
        />
      )}
    </>
  );
}

export default QuestionItem;
