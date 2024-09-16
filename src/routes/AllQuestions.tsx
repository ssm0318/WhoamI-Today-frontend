import { useTranslation } from 'react-i18next';
import useSWRInfinite from 'swr/infinite';
import NoContents from '@components/_common/no-contents/NoContents';
import PromptCard from '@components/_common/prompt/PromptCard';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PaginationResponse } from '@models/api/common';
import { Question } from '@models/post';
import { getAllQuestions } from '@utils/apis/question';
import { AllQuestionsLoader, PromptCardLoader } from 'src/routes/questions/AllQuestionsLoader';
import { MainScrollContainer } from './Root';

const getKey = (pageIndex: number, previousPageData: PaginationResponse<Question[]>) => {
  if (previousPageData && !previousPageData.next) return null; // 끝에 도달
  return `/qna/questions/?page=${pageIndex + 1}`; // SWR 키
};

function AllQuestions() {
  const [t] = useTranslation('translation');

  const {
    data: questions,
    size,
    setSize,
    isLoading,
  } = useSWRInfinite(getKey, (url) => {
    return getAllQuestions(url);
  });

  const isEndPage = questions && !questions[size - 1]?.next;
  const isLoadingMore =
    isLoading || (size > 0 && questions && typeof questions[size - 1] === 'undefined');

  const fetchQuestions = async () => {
    if (isEndPage) return;
    setSize((prevSize) => prevSize + 1);
  };

  const { targetRef } = useInfiniteScroll<HTMLDivElement>(() => {
    fetchQuestions();
  });

  return (
    <MainScrollContainer>
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
