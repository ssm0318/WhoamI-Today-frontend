import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import SendPromptModal from '@components/_common/prompt/SendPromptModal';
import { Layout, Typo } from '@design-system';
import * as S from './HighlightQuestionSection.styled';

type HighlightQuestionSectionProps = {
  question: string;
  tag: string;
  questionId: number;
};

function HighlightQuestionSection({ question, tag, questionId }: HighlightQuestionSectionProps) {
  const navigate = useNavigate();
  const [sendPromptModalVisible, setSendPromptBottomModalVisible] = useState(false);

  const handleClickRespond = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/questions/${questionId}/new`);
  };

  const handleClickSend = (e: MouseEvent) => {
    e.stopPropagation();
    setSendPromptBottomModalVisible(true);
  };

  const onCloseSendBottomModal = () => {
    setSendPromptBottomModalVisible(false);
  };

  return (
    <>
      <S.HighlightSectionWrapper>
        <Layout.FlexRow bgColor="TERTIARY_PINK" ph={8} rounded={100}>
          <Typo bold type="label-medium" color="WHITE">
            {tag}
          </Typo>
        </Layout.FlexRow>
        <S.Title>{question}</S.Title>

        <Layout.FlexRow w="100%" justifyContent="flex-end" gap={18}>
          <Icon name="question_respond" size={22} onClick={handleClickRespond} />
          <Icon name="question_send" size={22} color="WHITE" onClick={handleClickSend} />
        </Layout.FlexRow>
      </S.HighlightSectionWrapper>
      {sendPromptModalVisible && (
        <SendPromptModal
          visible={sendPromptModalVisible}
          onClose={onCloseSendBottomModal}
          questionId={questionId}
        />
      )}
    </>
  );
}

export default HighlightQuestionSection;
