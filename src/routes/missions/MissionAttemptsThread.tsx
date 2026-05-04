import { useParams, useSearchParams } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import PromptSummaryCard from '@components/_common/prompt-summary-card/PromptSummaryCard';
import MissionGroupItem from '@components/note/mission-group-item/MissionGroupItem';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { PaginationResponse } from '@models/api/common';
import { MissionGroupItem as MissionGroupItemModel, Note, POST_TYPE } from '@models/post';
import { MainScrollContainer } from '../Root';

type MissionAttemptsPage = PaginationResponse<Note[]> & {
  id: number;
  prompt: string;
  type: string;
};

function MissionAttemptsThread() {
  const { missionId } = useParams();
  const isValidMissionId = !!missionId && /^\d+$/.test(missionId);

  const [searchParams] = useSearchParams();
  const isDiscover = searchParams.get('discover') === 'true';
  const queryStr = isDiscover ? '?discover=true' : '';

  const {
    targetRef,
    data: pages,
    isLoading,
    isLoadingMore,
  } = useSWRInfiniteScroll<Note>({
    key: isValidMissionId ? `/missions/${missionId}/attempts/${queryStr}` : '',
  });

  const firstPage = pages?.[0] as MissionAttemptsPage | undefined;
  const attempts = pages?.flatMap((page) => page.results ?? []) ?? [];
  const promptDate = attempts[0]?.created_at;
  const missionGroups = firstPage
    ? groupMissionAttempts(attempts, firstPage.id, firstPage.prompt)
    : [];

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
            {missionGroups.length > 0 ? (
              missionGroups.map((group) => (
                <MissionGroupItem
                  key={group.author_detail?.id ?? group.author ?? group.created_at}
                  group={group}
                  hidePromptCard
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

function groupMissionAttempts(
  attempts: Note[],
  missionId: number,
  missionPrompt: string,
): MissionGroupItemModel[] {
  const groupsByAuthor = new Map<string, Note[]>();

  attempts.forEach((attempt) => {
    const authorKey = String(attempt.author_detail?.id ?? attempt.author ?? attempt.id);
    const groupAttempts = groupsByAuthor.get(authorKey) ?? [];
    groupAttempts.push(attempt);
    groupsByAuthor.set(authorKey, groupAttempts);
  });

  return Array.from(groupsByAuthor.values())
    .map<MissionGroupItemModel>((groupAttempts) => {
      const attemptsByAttemptOrder = [...groupAttempts].sort(compareMissionAttemptOrder);
      const latestAttempt = [...groupAttempts].sort(compareCreatedDesc)[0];

      return {
        type: POST_TYPE.MISSION_GROUP,
        mission_id: missionId,
        mission_prompt: missionPrompt,
        author: latestAttempt.author,
        author_detail: latestAttempt.author_detail,
        created_at: latestAttempt.created_at,
        updated_at: latestAttempt.updated_at,
        attempts: attemptsByAttemptOrder,
      };
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function compareMissionAttemptOrder(a: Note, b: Note) {
  const aAttempt = a.mission_attempt_number ?? Number.MAX_SAFE_INTEGER;
  const bAttempt = b.mission_attempt_number ?? Number.MAX_SAFE_INTEGER;
  if (aAttempt !== bAttempt) return aAttempt - bAttempt;
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}

function compareCreatedDesc(a: Note, b: Note) {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

export default MissionAttemptsThread;
