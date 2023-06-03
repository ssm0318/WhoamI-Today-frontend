import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import SendQuestionModal from '@components/question/send-question-modal/SendQuestionModal';
import QuestionItem from '@components/response/question-item/QuestionItem';
import ResponseItem from '@components/response/response-item/ResponseItem';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, SvgIcon } from '@design-system';
import { shortAnswerQuestions } from '@mock/questions';
import { responseList } from '@mock/responses';
import { userList } from '@mock/users';

function ResponseHistory() {
  const { questionId } = useParams();
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const navigate = useNavigate();

  // questionId로 질문 상세 가져와서 보여주기
  // 내가 작성한 답변도 있다면 보여줘야 함
  console.log(questionId);
  // TODO 실제 데이터로 바꾸기
  const question = shortAnswerQuestions[0];
  const responses = responseList;

  const handleClickResponse = () => {
    navigate(`/response/short-answer`, { state: question });
  };

  const handleSend = () => {
    setSendModalVisible(true);
  };

  return (
    <MainContainer>
      <TitleHeader
        RightComponent={
          <button type="button" onClick={handleClickResponse}>
            <SvgIcon name="moment_description_normal" size={36} />
          </button>
        }
      />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" ph={DEFAULT_MARGIN} gap={20}>
        {/* 질문 아이템 */}
        <QuestionItem question={question} onSend={handleSend} disableClickQuestion />
        {/* 이전 답변들 */}
        <Layout.FlexCol w="100%" gap={24}>
          {responses.map((response) => (
            <ResponseItem response={response} key={response.id} />
          ))}
        </Layout.FlexCol>
      </Layout.FlexCol>
      {/* TODO 실제 userList 적용 필요 */}
      <SendQuestionModal
        userList={userList}
        isVisible={sendModalVisible}
        setIsVisible={setSendModalVisible}
      />
    </MainContainer>
  );
}

export default ResponseHistory;
