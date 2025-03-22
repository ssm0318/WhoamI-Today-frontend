import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import NoContents from '@components/_common/no-contents/NoContents';
import PromptCard from '@components/_common/prompt/PromptCard';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { PaginationResponse } from '@models/api/common';
import { Question } from '@models/post';
import { getMe } from '@utils/apis/my';
import { getAllQuestions } from '@utils/apis/question';
import { getDateFromFormattedString, getFormattedDate } from '@utils/timeHelpers';
import { AllQuestionsLoader, PromptCardLoader } from 'src/routes/questions/AllQuestionsLoader';
import { MainScrollContainer } from './Root';

// TODO 백엔드에서 그루핑 해주는거 받아서 수정 필요
const groupQuestionsByDate = (questions: PaginationResponse<Question[]>[]) => {
  const groupedQuestions = new Map<string, Question[]>();

  questions.forEach(({ results }) => {
    results?.forEach((question: Question) => {
      const formattedDate = getFormattedDate(
        question.selected_dates[question.selected_dates.length - 1],
      );

      if (!groupedQuestions.has(formattedDate)) {
        groupedQuestions.set(formattedDate, []);
      }

      const dateQuestions = groupedQuestions.get(formattedDate);
      if (dateQuestions) {
        dateQuestions.push(question);
      }
    });
  });

  return Array.from(groupedQuestions.entries()).sort(
    ([dateA], [dateB]) =>
      getDateFromFormattedString(dateB).getTime() - getDateFromFormattedString(dateA).getTime(),
  );
};

function AllQuestions() {
  const [t] = useTranslation('translation');

  const {
    targetRef,
    data: questions,
    isLoadingMore,
    isLoading,
  } = useSWRInfiniteScroll<Question>({ key: '/qna/questions/' });

  const { scrollRef } = useRestoreScrollPosition('questionsPage');

  const handleRefresh = useCallback(async () => {
    await Promise.all([getAllQuestions(null), getMe()]);
  }, []);

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol
          pv={14}
          w="100%"
          ph={DEFAULT_MARGIN}
          gap={20}
          pb={FLOATING_BUTTON_SIZE + 20}
        >
          {isLoading ? (
            <AllQuestionsLoader />
          ) : questions?.[0] && questions[0].count > 0 ? (
            <>
              {groupQuestionsByDate(questions).map(([date, dateQuestions]) => (
                <Layout.FlexCol key={date} w="100%">
                  {/* Date header */}
                  <Layout.FlexRow justifyContent="flex-start" w="100%" mb={10}>
                    <Typo type="body-large" color="BLACK" bold>
                      {date}
                    </Typo>
                  </Layout.FlexRow>

                  {/* Questions for this date */}
                  <Layout.FlexCol w="100%" gap={10}>
                    {dateQuestions.map((question: Question) => (
                      <PromptCard
                        key={question.id}
                        id={question.id}
                        content={question.content}
                        widthMode="full"
                      />
                    ))}
                  </Layout.FlexCol>
                </Layout.FlexCol>
              ))}
              <div ref={targetRef} />
              {isLoadingMore && <PromptCardLoader />}
            </>
          ) : (
            <NoContents text={t('no_contents.all_questions')} mv={10} />
          )}
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default AllQuestions;
