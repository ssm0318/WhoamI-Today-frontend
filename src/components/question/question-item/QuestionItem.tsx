import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SendPromptModal from '@components/_common/prompt/SendPromptModal';
import { Font, Layout, SvgIcon } from '@design-system';
import { Question } from '@models/post';

type QuestionItemProps = {
  question: Question;
};

// 주관식
/**
 * @deprecated
 */
function QuestionItem({ question }: QuestionItemProps) {
  const { content } = question;
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleSend = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSendModalVisible(true);
  };

  const handleResponse = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/questions/${question.id}/new`);
  };

  const handleClickQuestion = () => {
    navigate(`/response-history/${question.id}`);
  };

  const handleCloseModal = () => setSendModalVisible(false);

  return (
    <>
      <Layout.FlexRow
        p={16}
        bgColor="LIGHT"
        rounded={12}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        onClick={handleClickQuestion}
      >
        <Font.Body type="18_regular">{content}</Font.Body>
        <Layout.FlexRow gap={4}>
          <button type="button" onClick={handleResponse}>
            <SvgIcon name="moment_description_normal" size={36} />
          </button>
          <button type="button" onClick={handleSend}>
            <SvgIcon name="question_send" size={36} />
          </button>
        </Layout.FlexRow>
      </Layout.FlexRow>
      <SendPromptModal
        visible={sendModalVisible}
        onClose={handleCloseModal}
        questionId={question.id}
      />
    </>
  );
}

export default QuestionItem;
