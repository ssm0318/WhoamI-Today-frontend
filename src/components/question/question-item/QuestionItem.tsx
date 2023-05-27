import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Font, Layout, SvgIcon } from '@design-system';
import { Question } from '@models/post';
import SendQuestionModal from '../send-question-modal/SendQuestionModal';

interface QuestionItemProps extends Question {}

const userList = [
  { id: 1, profile_pic: '', name: 'gina' },
  { id: 2, profile_pic: '', name: 'gina2' },
  { id: 3, profile_pic: '', name: 'gina3' },
];

function QuestionItem({ content, id }: QuestionItemProps) {
  const navigate = useNavigate();
  const [sendModalVisible, setSendModalVisible] = useState(false);

  const handleSend = () => {
    // TODO 친구 모달 등장
    console.log(id);
  };

  const handleResponse = () => {
    navigate(`/question-response/${id}`, {
      state: {
        question: content,
      },
    });
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
