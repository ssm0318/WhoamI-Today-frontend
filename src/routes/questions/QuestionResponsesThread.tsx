import { MouseEvent, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import SendPromptModal from '@components/_common/prompt/SendPromptModal';
import PromptSummaryCard from '@components/_common/prompt-summary-card/PromptSummaryCard';
import ResponseItem from '@components/response/response-item/ResponseItem';
import SubHeader from '@components/sub-header/SubHeader';
import { Colors, Layout, SvgIcon, Typo } from '@design-system';
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

const LeaveResponseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
  min-height: 42px;
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  background: ${Colors.PRIMARY};
  cursor: pointer;
`;

const AskFriendsButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
  min-height: 42px;
  padding: 10px 16px;
  border: 1.5px solid ${Colors.PRIMARY};
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
`;

function QuestionResponsesThread() {
  const { questionId } = useParams();
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const isValidQuestionId = !!questionId && /^\d+$/.test(questionId);
  const navigate = useNavigate();
  const [sendPromptModalVisible, setSendPromptModalVisible] = useState(false);

  const [searchParams] = useSearchParams();
  const isDiscover = searchParams.get('discover') === 'true';
  const queryStr = isDiscover ? '?discover=true' : '';

  const {
    targetRef,
    data: pages,
    isLoading,
    isLoadingMore,
  } = useSWRInfiniteScroll<Response>({
    key: isValidQuestionId ? `/qna/questions/${questionId}/responses/${queryStr}` : '',
  });

  const firstPage = pages?.[0] as QuestionResponsesPage | undefined;
  const responses = pages?.flatMap((page) => page.results ?? []) ?? [];
  const promptDate =
    firstPage?.selected_dates?.[firstPage.selected_dates.length - 1] ?? firstPage?.created_at;

  const handleLeaveResponse = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigate(`/questions/${questionId}/new`);
  };

  const handleAskFriends = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSendPromptModalVisible(true);
  };

  return (
    <>
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
              {isDiscover && (
                <Layout.FlexRow w="100%" gap={10}>
                  <LeaveResponseButton
                    id="digest-leave-response-btn"
                    type="button"
                    onClick={handleLeaveResponse}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        transform: 'scale(1.4)',
                        transformOrigin: 'center',
                      }}
                    >
                      <SvgIcon name="edit_filled_white" size={16} />
                    </span>
                    <Typo type="label-large" color="WHITE" fontWeight={600}>
                      Answer This
                    </Typo>
                  </LeaveResponseButton>
                  <AskFriendsButton
                    id="digest-ask-friends-btn"
                    type="button"
                    onClick={handleAskFriends}
                  >
                    <SvgIcon name="question_send" size={16} color="PRIMARY" />
                    <Typo type="label-large" color="PRIMARY" fontWeight={600}>
                      Ask friends
                    </Typo>
                  </AskFriendsButton>
                </Layout.FlexRow>
              )}
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
      {sendPromptModalVisible && questionId && (
        <SendPromptModal
          visible={sendPromptModalVisible}
          onClose={() => setSendPromptModalVisible(false)}
          questionId={Number(questionId)}
        />
      )}
    </>
  );
}

export default QuestionResponsesThread;
