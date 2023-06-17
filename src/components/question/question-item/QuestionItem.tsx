import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Font, Layout, SvgIcon } from '@design-system';
import { userList } from '@mock/users';
import { Question } from '@models/post';
import SendQuestionModal from '../send-question-modal/SendQuestionModal';

type QuestionItemProps = {
  question: Question;
};

// 주관식
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
    navigate(`/response/short-answer`, { state: question });
  };

  const handleClickQuestion = () => {
    navigate(`/response-history/${question.id}`);
  };

  return (
    <>
      <Layout.FlexRow
        p={16}
        bgColor="GRAY_7"
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
      <SendQuestionModal
        userList={userList}
        isVisible={sendModalVisible}
        setIsVisible={setSendModalVisible}
      />
    </>
  );
}

export default QuestionItem;
