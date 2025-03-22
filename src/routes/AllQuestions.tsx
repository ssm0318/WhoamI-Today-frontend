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
import { Question, QuestionGroup } from '@models/post';
import { getMe } from '@utils/apis/my';
import { getAllQuestions } from '@utils/apis/question';
import { getFormattedDate } from '@utils/timeHelpers';
import { AllQuestionsLoader, PromptCardLoader } from 'src/routes/questions/AllQuestionsLoader';
import { MainScrollContainer } from './Root';

function AllQuestions() {
  const [t] = useTranslation('translation');

  const {
    targetRef,
    data: questionGroups,
    isLoadingMore,
    isLoading,
  } = useSWRInfiniteScroll<QuestionGroup>({ key: '/qna/questions/' });

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
          ) : questionGroups?.[0] && questionGroups[0].count > 0 ? (
            <>
              {questionGroups.map(({ results }) =>
                results?.map((questionGroup) => (
                  <Layout.FlexCol key={questionGroup.date} w="100%">
                    {/* Date header */}
                    <Layout.FlexRow justifyContent="flex-start" w="100%" mb={10}>
                      <Typo type="body-large" color="BLACK" bold>
                        {getFormattedDate(questionGroup.date)}
                      </Typo>
                    </Layout.FlexRow>
                    {/* Questions for this date */}
                    <Layout.FlexCol w="100%" gap={10}>
                      {questionGroup.questions.map((question: Question) => (
                        <PromptCard
                          key={question.id}
                          id={question.id}
                          content={question.content}
                          widthMode="full"
                        />
                      ))}
                    </Layout.FlexCol>
                  </Layout.FlexCol>
                )),
              )}
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
