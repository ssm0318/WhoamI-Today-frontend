import { useParams } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import PromptSummaryCard from '@components/_common/prompt-summary-card/PromptSummaryCard';
import ResponseItem from '@components/response/response-item/ResponseItem';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { PaginationResponse } from '@models/api/common';
import { Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { MainScrollContainer } from '../Root';

type QuestionResponsesPage = PaginationResponse<Response[]> & {
  id: number;
  content: string;
  type: string;
  created_at: string;
  selected_dates: string[];
};

function QuestionResponsesThread() {
  const { questionId } = useParams();
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const isValidQuestionId = !!questionId && /^\d+$/.test(questionId);

  const {
    targetRef,
    data: pages,
    isLoading,
    isLoadingMore,
  } = useSWRInfiniteScroll<Response>({
    key: isValidQuestionId ? `/qna/questions/${questionId}/responses/` : '',
  });

  const firstPage = pages?.[0] as QuestionResponsesPage | undefined;
  const responses = pages?.flatMap((page) => page.results ?? []) ?? [];
  const promptDate =
    firstPage?.selected_dates?.[firstPage.selected_dates.length - 1] ?? firstPage?.created_at;

  return (
    <MainScrollContainer>
      <SubHeader title="Question" />
      <Layout.FlexCol w="100%" ph={16} pt={12} pb={100} gap={12}>
        {!isValidQuestionId ? (
          <NoContents text="Question not found." />
        ) : isLoading ? (
          <Layout.FlexRow w="100%" h={80}>
            <Loader />
          </Layout.FlexRow>
        ) : firstPage ? (
          <>
            <PromptSummaryCard content={firstPage.content} date={promptDate} />
            <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
              <Typo type="title-medium" color="BLACK" bold>
                Responses
              </Typo>
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {firstPage.count}
              </Typo>
            </Layout.FlexRow>
            {responses.length > 0 ? (
              responses.map((response) => (
                <ResponseItem
                  key={response.id}
                  response={response}
                  isMyPage={response.author_detail?.id === myProfile?.id}
                  hideQuestionPrompt
                />
              ))
            ) : (
              <NoContents text="No responses yet." />
            )}
            <div ref={targetRef} />
            {isLoadingMore && (
              <Layout.FlexRow w="100%" h={40}>
                <Loader />
              </Layout.FlexRow>
            )}
          </>
        ) : (
          <NoContents text="Question not found." />
        )}
      </Layout.FlexCol>
    </MainScrollContainer>
  );
}

export default QuestionResponsesThread;
