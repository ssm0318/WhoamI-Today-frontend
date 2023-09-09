import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '@components/_common/loader/Loader.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import NoContents from '@components/_common/no-contents/NoContents';
import SendQuestionModal from '@components/question/send-question-modal/SendQuestionModal';
import QuestionItem from '@components/response/question-item/QuestionItem';
import ResponseItem from '@components/response/response-item/ResponseItem';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, SvgIcon } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { GetResponseHistoriesResponse } from '@models/api/question';
import { getResponseHistories } from '@utils/apis/question';

function ResponseHistory() {
  const [t] = useTranslation('translation', { keyPrefix: 'no_contents' });

  const { questionId } = useParams();
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const navigate = useNavigate();
  const [responseHistory, setResponseHistory] = useState<FetchState<GetResponseHistoriesResponse>>({
    state: 'loading',
  });

  const handleClickResponse = () => {
    navigate(`/questions/${questionId}/short-answer`);
  };

  const handleSend = () => {
    setSendModalVisible(true);
  };

  const handleSkipSendQuestion = () => {
    setSendModalVisible(false);
  };

  useAsyncEffect(async () => {
    getResponseHistories(Number(questionId))
      .then((data) => {
        setResponseHistory({ state: 'hasValue', data });
      })
      .catch(() => {
        setResponseHistory({ state: 'hasError' });
      });
  }, [questionId]);

  return (
    <MainContainer>
      <TitleHeader
        RightComponent={
          <button type="button" onClick={handleClickResponse}>
            <SvgIcon name="moment_description_normal" size={36} />
          </button>
        }
      />
      {responseHistory.state === 'loading' ? (
        <Loader />
      ) : responseHistory.state === 'hasError' ? (
        <NoContents text={t('response_detail')} />
      ) : (
        <>
          <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" ph={DEFAULT_MARGIN}>
            {/* 질문 아이템 */}
            <QuestionItem
              question={responseHistory.data}
              onSend={handleSend}
              disableClickQuestion
            />
            {/* 이전 답변들 */}
            <Layout.FlexCol w="100%" gap={24} mt={64}>
              {responseHistory.data.response_set.map((response) => (
                <ResponseItem response={response} key={response.id} />
              ))}
            </Layout.FlexCol>
          </Layout.FlexCol>
          <SendQuestionModal
            questionId={responseHistory.data.id}
            isVisible={sendModalVisible}
            setIsVisible={setSendModalVisible}
            onSkip={handleSkipSendQuestion}
          />
        </>
      )}
    </MainContainer>
  );
}

export default ResponseHistory;
