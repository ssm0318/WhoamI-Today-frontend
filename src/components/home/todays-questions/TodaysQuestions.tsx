import { addDays, format, isAfter, isBefore, isEqual, isSameDay, subDays } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TODAY_QUESTION_FIRST_DATE } from '@constants/question';
import { Button, Font, Layout, SvgIcon } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { MultipleChoiceQuestion, ShortAnswerQuestion } from '@models/post';
import { BoundState, useBoundStore } from '@stores/useBoundStore';

const todaysQuestionsSelector = (state: BoundState) => ({
  shortAnswerQuestion: state.shortAnswerQuestion,
  multipleChoiceQuestions: state.multipleChoiceQuestions,
  fetchTodaysQuestions: state.fetchTodaysQuestions,
});

function TodaysQuestions() {
  const { fetchTodaysQuestions, shortAnswerQuestion, multipleChoiceQuestions } =
    useBoundStore(todaysQuestionsSelector);
  const [t] = useTranslation('translation', { keyPrefix: 'home.question' });
  // 오늘 날짜
  const today = new Date();
  const navigate = useNavigate();
  // TODAY_QUESTION_FIRST_DATE와 today를 비교 후, 더 나중 날짜를 currentDate로 set
  // TODAY_QUESTION_FIRST_DATE보다 이전에 접속하면 항상 TODAY_QUESTION_FIRST_DATE로 유지
  // TODO currentDate 기준으로 나중에 오늘의 질문 data 요청할 예정
  const [currentDate, setCurrentDate] = useState(
    isBefore(today, TODAY_QUESTION_FIRST_DATE) ? TODAY_QUESTION_FIRST_DATE : today,
  );

  const moveToPrevDate = () => {
    if (!isPrevButtonExists) return;
    setCurrentDate(subDays(currentDate, 1));
  };

  const moveToNextDate = () => {
    if (!isNextButtonExists) return;
    setCurrentDate(addDays(currentDate, 1));
  };

  const isPrevButtonExists = isAfter(currentDate, TODAY_QUESTION_FIRST_DATE);
  const isNextButtonExists = !(isAfter(currentDate, today) || isEqual(currentDate, today));

  useAsyncEffect(async () => {
    await fetchTodaysQuestions();
  }, []);

  const handleShortAnswer = (question: ShortAnswerQuestion) => {
    navigate(`/question/${question.id}`, { state: question });
  };

  const handleMultipleChoice = (questions: MultipleChoiceQuestion[]) => {
    // TODO 객관식 상세 페이지로 이동
    console.log(questions);
  };

  return (
    <Layout.FlexCol w="100%" bgColor="BACKGROUND_COLOR" ph="default" pt={22} pb={100}>
      {/* 타이틀 */}
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center" h={38}>
        <Layout.LayoutBase onClick={moveToPrevDate} w={36} h={36}>
          {isPrevButtonExists && <SvgIcon name="arrow_left" size={36} />}
        </Layout.LayoutBase>
        <Font.Display type="18_bold">
          {isSameDay(currentDate, today) || isBefore(today, TODAY_QUESTION_FIRST_DATE)
            ? `${t('todays_questions')}`
            : format(currentDate, 'yyyy/MM/dd')}
        </Font.Display>
        <Layout.LayoutBase onClick={moveToNextDate} w={36} h={36}>
          {isNextButtonExists && <SvgIcon name="arrow_right" size={36} />}
        </Layout.LayoutBase>
      </Layout.FlexRow>
      {/* 컨텐츠 */}
      {/* Short Answer */}
      {shortAnswerQuestion && (
        <>
          <Layout.FlexRow
            mb={10}
            mt={32}
            justifyContent="space-between"
            w="100%"
            alignItems="center"
          >
            <Font.Display type="14_regular" color="GRAY_3">
              {t('short_answer')}
            </Font.Display>
            <Button.Small text={t('see_all')} type="white_fill" status="normal" to="/questions" />
          </Layout.FlexRow>
          <Layout.FlexRow
            bgColor="GRAY_2"
            w="100%"
            ph={16}
            pv={14}
            rounded={10}
            justifyContent="center"
            onClick={() => handleShortAnswer(shortAnswerQuestion)}
          >
            <Font.Body type="18_regular" textAlign="center">
              {shortAnswerQuestion.content}
            </Font.Body>
          </Layout.FlexRow>
        </>
      )}
      {/* Multiple Choice */}
      {multipleChoiceQuestions.length !== 0 && (
        <>
          <Layout.FlexRow mt={20} mb={8} justifyContent="flex-start" w="100%" alignItems="center">
            <Font.Display type="14_regular" color="GRAY_3">
              {t('multiple_choice')}
            </Font.Display>
          </Layout.FlexRow>
          <Layout.LayoutBase
            bgColor="GRAY_2"
            w="100%"
            ph={16}
            pv={14}
            rounded={10}
            alignItems="center"
            onClick={() => handleMultipleChoice(multipleChoiceQuestions)}
          >
            {multipleChoiceQuestions.map((question, index) => (
              <Font.Body type="18_regular" textAlign="center" key={question.id}>
                {index + 1}. {question.content}
              </Font.Body>
            ))}
          </Layout.LayoutBase>
        </>
      )}
    </Layout.FlexCol>
  );
}

export default TodaysQuestions;
