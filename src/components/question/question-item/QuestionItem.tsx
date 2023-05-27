import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Font, Layout, SvgIcon } from '@design-system';
import { Question, QUESTION_TYPE } from '@models/post';
import SendQuestionModal from '../send-question-modal/SendQuestionModal';

type QuestionItemProps = {
  question: Question;
};

const userList = [
  { id: 1, profile_pic: '', name: 'gina' },
  { id: 2, profile_pic: '', name: 'gina2' },
  { id: 3, profile_pic: '', name: 'gina3' },
];

// 주관식
// 객관식
function QuestionItem({ question }: QuestionItemProps) {
  const { content, type } = question;
  const [sendModalVisible, setSendModalVisible] = useState(false);

  const handleSend = () => {
    setSendModalVisible(true);
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
      >
        <Font.Body type="18_regular">{content}</Font.Body>
        {type === QUESTION_TYPE.SHORT_ANSWER && (
          <Layout.FlexRow gap={4}>
            <Link to="/short-answer-response" state={question}>
              <SvgIcon name="moment_description_normal" size={36} />
            </Link>
            <button type="button" onClick={handleSend}>
              <SvgIcon name="question_send" size={36} />
            </button>
          </Layout.FlexRow>
        )}
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
