import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import SendQuestionModal from '@components/question/send-question-modal/SendQuestionModal';
import { Font, Layout, SvgIcon } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { ShortAnswerQuestion } from '@models/post';
import { BoundState, useBoundStore } from '@stores/useBoundStore';

const todaysQuestionsSelector = (state: BoundState) => ({
  shortAnswerQuestions: state.shortAnswerQuestions,
  fetchTodaysQuestions: state.fetchTodaysQuestions,
});

function TodaysQuestions() {
  const { fetchTodaysQuestions, shortAnswerQuestions } = useBoundStore(todaysQuestionsSelector);
  const [t] = useTranslation('translation', { keyPrefix: 'home.question' });
  const navigate = useNavigate();
  const [sendModalVisible, setSendModalVisible] = useState(false);

  const handleShortAnswer = (question: ShortAnswerQuestion) => {
    navigate(`/questions/${question.id}/short-answer`);
  };

  const handleResponse = (questionId: number) => {
    navigate(`/questions/${questionId}/short-answer`);
  };

  const handleSend = () => {
    setSendModalVisible(true);
  };

  useAsyncEffect(async () => {
    await fetchTodaysQuestions();
  }, []);

  return (
    <Layout.FlexCol w="100%" bgColor="WHITE" ph="default" pt={22} pb={100}>
      <Layout.FlexCol bgColor="GRAY_14" rounded={14} w="100%" ph={16} pv={24}>
        {/* 제목 */}
        <Layout.FlexRow w="100%" justifyContent="center" alignItems="center">
          <Font.Display type="18_bold">{t('todays_questions')}</Font.Display>
        </Layout.FlexRow>
        {/* 질문 */}
        <Layout.FlexCol w="100%" gap={12} alignItems="center" mt={12}>
          {shortAnswerQuestions.map((saq) => (
            <Layout.FlexCol w="100%" key={saq.id}>
              <Layout.FlexRow
                bgColor="SECONDARY"
                w="100%"
                ph={16}
                pv={12}
                rounded={14}
                justifyContent="center"
                onClick={() => handleShortAnswer(saq)}
                key={saq.id}
              >
                <Font.Body type="18_regular" textAlign="center">
                  {saq.content}
                </Font.Body>
              </Layout.FlexRow>
              {/* 버튼 */}
              <Layout.FlexRow gap={32} w="100%" justifyContent="center" mt={24} mb={12}>
                <button type="button" onClick={() => handleResponse(saq.id)}>
                  <SvgIcon name="moment_description_normal" size={36} />
                </button>
                <button type="button" onClick={handleSend}>
                  <SvgIcon name="question_send" size={36} />
                </button>
              </Layout.FlexRow>
              <SendQuestionModal
                questionId={saq.id}
                isVisible={sendModalVisible}
                setIsVisible={setSendModalVisible}
              />
            </Layout.FlexCol>
          ))}
        </Layout.FlexCol>
        {/* 더 보기 */}
        <Layout.FlexRow w="100%" justifyContent="center">
          <Link to="/questions">
            <Font.Body type="14_regular" color="DARK_GRAY" underline>
              {t('see_all')}
            </Font.Body>
          </Link>
        </Layout.FlexRow>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default TodaysQuestions;
