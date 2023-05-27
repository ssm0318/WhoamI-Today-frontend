import { useState } from 'react';
import { Font, Layout, SvgIcon } from '@design-system';
import { Question, QUESTION_TYPE } from '@models/post';
import SendQuestionModal from '../../question/send-question-modal/SendQuestionModal';

interface QuestionItemProps {
  question: Question;
}

const userList = [
  { id: 1, profile_pic: '', name: 'gina' },
  { id: 2, profile_pic: '', name: 'gina2' },
  { id: 3, profile_pic: '', name: 'gina3' },
];

function QuestionItem({ question }: QuestionItemProps) {
  const { type, content } = question;
  const [sendModalVisible, setSendModalVisible] = useState(false);

  const handleSend = () => {
    setSendModalVisible(true);
  };

  return (
    <>
      <Layout.FlexCol
        pt={type === QUESTION_TYPE.MULTIPLE_CHOICE ? 28 : 22}
        pb={type === QUESTION_TYPE.MULTIPLE_CHOICE ? 28 : 20}
        ph={20}
        rounded={14.5}
        bgColor="GRAY_7"
        w="100%"
        alignItems="center"
      >
        <Font.Body type="20_regular" color="GRAY_6" textAlign="center">
          {content}
        </Font.Body>
        {type === QUESTION_TYPE.SHORT_ANSWER && (
          <Layout.FlexRow w="100%" alignItems="center" justifyContent="flex-end" mt={5}>
            <button type="button" onClick={handleSend}>
              <SvgIcon name="question_send" size={36} />
            </button>
          </Layout.FlexRow>
        )}
      </Layout.FlexCol>
      <SendQuestionModal
        userList={userList}
        isVisible={sendModalVisible}
        setIsVisible={setSendModalVisible}
      />
    </>
  );
}

export default QuestionItem;
