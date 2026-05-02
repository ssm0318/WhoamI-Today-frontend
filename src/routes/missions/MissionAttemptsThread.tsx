import { useParams } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import PromptSummaryCard from '@components/_common/prompt-summary-card/PromptSummaryCard';
import NoteItem from '@components/note/note-item/NoteItem';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { PaginationResponse } from '@models/api/common';
import { Note } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { MainScrollContainer } from '../Root';

type MissionAttemptsPage = PaginationResponse<Note[]> & {
  id: number;
  prompt: string;
  type: string;
};

function MissionAttemptsThread() {
  const { missionId } = useParams();
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const isValidMissionId = !!missionId && /^\d+$/.test(missionId);

  const {
    targetRef,
    data: pages,
    isLoading,
    isLoadingMore,
  } = useSWRInfiniteScroll<Note>({
    key: isValidMissionId ? `/missions/${missionId}/attempts/` : '',
  });

  const firstPage = pages?.[0] as MissionAttemptsPage | undefined;
  const attempts = pages?.flatMap((page) => page.results ?? []) ?? [];
  const promptDate = attempts[0]?.created_at;

  return (
    <MainScrollContainer>
      <SubHeader title="Mission" />
      <Layout.FlexCol w="100%" ph={16} pt={12} pb={100} gap={12}>
        {!isValidMissionId ? (
          <NoContents text="Mission not found." />
        ) : isLoading ? (
          <Layout.FlexRow w="100%" h={80}>
            <Loader />
          </Layout.FlexRow>
        ) : firstPage ? (
          <>
            <PromptSummaryCard content={firstPage.prompt} date={promptDate} />
            <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
              <Typo type="title-medium" color="BLACK" bold>
                Attempts
              </Typo>
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {firstPage.count}
              </Typo>
            </Layout.FlexRow>
            {attempts.length > 0 ? (
              attempts.map((attempt) => (
                <NoteItem
                  key={attempt.id}
                  note={attempt}
                  isMyPage={attempt.author_detail?.id === myProfile?.id}
                  hideMissionPrompt
                />
              ))
            ) : (
              <NoContents text="No attempts yet." />
            )}
            <div ref={targetRef} />
            {isLoadingMore && (
              <Layout.FlexRow w="100%" h={40}>
                <Loader />
              </Layout.FlexRow>
            )}
          </>
        ) : (
          <NoContents text="Mission not found." />
        )}
      </Layout.FlexCol>
    </MainScrollContainer>
  );
}

export default MissionAttemptsThread;
