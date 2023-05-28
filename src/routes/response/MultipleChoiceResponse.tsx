import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import QuestionItem from '@components/response/question-item/QuestionItem';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';
import { MultipleChoiceQuestion } from '@models/post';

// NOTE 객관식 질문은 추후에 추가 예정
// 객관식 질문 답변
function MultipleChoiceResponse() {
  const { state: questions } = useLocation() as {
    state: MultipleChoiceQuestion[];
  };
  const [answerInfo, setAnswerInfo] = useState<{ questionId: number; answer: number | null }[]>(
    questions.map((q) => ({ questionId: q.id, answer: null })),
  );

  const [t] = useTranslation('translation', { keyPrefix: 'question.response' });

  const handlePost = () => {
    // TODO 답변 업로드
  };

  const handleSelectAnswer = (questionId: number, answer: number) => {
    const target = answerInfo.find((a) => a.questionId === questionId);
    if (!target) return;
    const isSelected = !!(target.answer === answer);

    // 선택
    if (!isSelected) {
      const updatedAnswerInfo = answerInfo.map((a) =>
        a.questionId === questionId ? { ...a, answer } : a,
      );
      setAnswerInfo(updatedAnswerInfo);
    } else {
      // 해제
      const updatedAnswerInfo = answerInfo.map((a) =>
        a.questionId === questionId ? { ...a, answer: null } : a,
      );
      setAnswerInfo(updatedAnswerInfo);
    }
  };

  return (
    <MainContainer>
      <TitleHeader
        RightComponent={
          <button type="button" onClick={handlePost}>
            <Font.Display type="18_bold">{t('post')}</Font.Display>
          </button>
        }
      />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" ph={DEFAULT_MARGIN} pb={60} gap={60}>
        {questions.map((question) => (
          <Layout.FlexCol key={question.id} w="100%">
            <QuestionItem question={question} />
            <Layout.FlexCol gap={12} mt={24} alignItems="center" w="100%">
              {question.answerList.map((answer) => (
                <Layout.FlexRow
                  key={answer.value}
                  w={250}
                  alignItems="center"
                  justifyContent="flex-start"
                  onClick={() => handleSelectAnswer(question.id, answer.value)}
                >
                  <SvgIcon
                    name={
                      answerInfo.find((a) => a.questionId === question.id)?.answer === answer.value
                        ? 'box_check_checked'
                        : 'box_check_unchecked'
                    }
                    size={24}
                  />
                  <Font.Body type="20_regular" ml={14}>
                    {answer.text}
                  </Font.Body>
                </Layout.FlexRow>
              ))}
            </Layout.FlexCol>
          </Layout.FlexCol>
        ))}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default MultipleChoiceResponse;
