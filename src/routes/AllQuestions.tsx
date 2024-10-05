import { useTranslation } from 'react-i18next';
import NoContents from '@components/_common/no-contents/NoContents';
import PromptCard from '@components/_common/prompt/PromptCard';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Layout } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { Question } from '@models/post';
import { AllQuestionsLoader, PromptCardLoader } from 'src/routes/questions/AllQuestionsLoader';
import { MainScrollContainer } from './Root';

function AllQuestions() {
  const [t] = useTranslation('translation');

  const {
    targetRef,
    data: questions,
    isLoadingMore,
    isLoading,
  } = useSWRInfiniteScroll<Question>({ key: '/qna/questions/' });

  const { scrollRef } = useRestoreScrollPosition('questionsPage');

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      <Layout.FlexCol pv={14} w="100%" ph={DEFAULT_MARGIN} gap={20}>
        {isLoading ? (
          <AllQuestionsLoader />
        ) : questions?.[0] && questions[0].count > 0 ? (
          <>
            {questions.map(({ results }) =>
              results?.map((question) => (
                <PromptCard question={question} key={question.id} widthMode="full" />
              )),
            )}
            <div ref={targetRef} />
            {isLoadingMore && <PromptCardLoader />}
          </>
        ) : (
          <NoContents text={t('no_contents.all_questions')} mv={10} />
        )}
      </Layout.FlexCol>
    </MainScrollContainer>
  );
}

export default AllQuestions;
