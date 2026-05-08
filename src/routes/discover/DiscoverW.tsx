import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';
import PostTypeTag from '@components/_common/post-type-tag/PostTypeTag';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { formatFullDate } from '@components/_common/prompt-summary-card/PromptSummaryCard';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import HighlightQuestionSection from '@components/discover/HighlightQuestionSection/HighlightQuestionSection';
import ProfileSuggestionCard from '@components/discover/ProfileSuggestionCard/ProfileSuggestionCard';
import SharedPlaylistSection, {
  SharedTrack,
} from '@components/friends/shared-playlist/SharedPlaylistSection';
import MissionGroupItemComponent from '@components/note/mission-group-item/MissionGroupItem';
import NoteItem from '@components/note/note-item/NoteItem';
import NoteLoader from '@components/note/note-loader/NoteLoader';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import { useChipCategories } from '@hooks/useChipCategories';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import {
  DiscoverWResponse,
  ProfileSuggestionCardBody,
  ProfileSuggestionField,
} from '@models/discover';
import {
  DailyQuestion,
  MissionGroupItem as MissionGroupItemModel,
  Note,
  POST_TYPE,
  Response,
} from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getDiscoverWFeed } from '@utils/apis/discover';
import { getMe } from '@utils/apis/my';
import { getTodayQuestions } from '@utils/apis/question';
import { MainScrollContainer } from 'src/routes/Root';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 16px ${DEFAULT_MARGIN}px 100px;
  background-color: ${Colors.WHITE};
  box-sizing: border-box;
`;

const Banner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px 0 8px;
  text-align: center;
  box-sizing: border-box;
`;

const DigestCard = styled.div<{ $bg?: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 16px;
  background: ${({ $bg }) => $bg ?? Colors.WHITE};
  box-sizing: border-box;
`;

const MissionPromptBlock = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background-color: ${Colors.WHITE};
  box-sizing: border-box;
`;

const QuestionPromptBlock = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background-color: ${Colors.WHITE};
  box-sizing: border-box;
`;

const QuestionTextCol = styled.div`
  flex: 1;
  min-width: 0;
`;

const PromptMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
  min-height: 18px;
`;

const SectionIntro = styled(Typo)`
  display: block;
  width: 100%;
`;

const ViewAllButton = styled.button<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  padding: 10px 24px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  color: ${({ $color }) => $color ?? Colors.PRIMARY};
  font-weight: 600;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.8;
  }
`;

const MusicBand = styled.section`
  width: calc(100% + ${DEFAULT_MARGIN * 2}px);
  margin-left: -${DEFAULT_MARGIN}px;
  margin-right: -${DEFAULT_MARGIN}px;
  padding: 20px 0 12px;
  background: ${Colors.SPOTIFY_GREEN};
  box-sizing: border-box;
`;

const MusicHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 ${DEFAULT_MARGIN}px 4px;
  box-sizing: border-box;
`;

type DigestFeedItem =
  | { type: 'mission-card' }
  | { type: 'question-card' }
  | { type: 'music-card' }
  | { type: 'today-question-card'; question: DailyQuestion }
  | { type: 'profile-suggestion-card'; suggestion: ProfileSuggestionCardBody }
  | { type: 'post'; post: Note | Response | MissionGroupItemModel };

const hashString = (value: string) => {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33 + value.charCodeAt(i)) % 2147483647;
  }
  return hash;
};

const seededRandom = (seed: number) => {
  let state = seed || 1;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

const shuffleWithSeed = <T,>(items: T[], seed: number) => {
  const next = [...items];
  const random = seededRandom(seed);
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const getDigestShuffleSlot = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const partValue = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const year = partValue('year');
  const month = partValue('month');
  const day = partValue('day');
  const hour = partValue('hour');
  let slotHour = 1;
  let slotDay = Date.UTC(year, month - 1, day);
  if (hour >= 19) slotHour = 19;
  else if (hour >= 13) slotHour = 13;
  else if (hour >= 7) slotHour = 7;
  else if (hour < 1) {
    slotHour = 19;
    slotDay -= 24 * 60 * 60 * 1000;
  }
  return `${slotDay}:${slotHour}`;
};

function DiscoverW() {
  const [t] = useTranslation('translation', { keyPrefix: 'daily_digest' });
  const [tProfileField] = useTranslation('translation', {
    keyPrefix: 'profile_suggestion_card.fields',
  });
  const navigate = useNavigate();
  const { scrollRef } = useRestoreScrollPosition('discoverPage');
  const myProfile = useBoundStore((state) => state.myProfile);
  const { categories: chipCategories } = useChipCategories();
  const { data, isLoading, mutate } = useSWR<DiscoverWResponse>(
    '/user/discover/',
    getDiscoverWFeed,
  );
  const { data: todayQuestions } = useSWR<DailyQuestion[]>(
    '/qna/questions/daily/',
    getTodayQuestions,
  );

  const handleRefresh = useCallback(async () => {
    await Promise.all([mutate(), getMe()]);
  }, [mutate]);

  const musicTracks: SharedTrack[] = useMemo(() => {
    if (!data?.yesterday_music?.tracks) return [];
    const tracksById = new Map<string, SharedTrack>();
    data.yesterday_music.tracks.forEach((song) => {
      const listener = {
        id: song.user.id,
        username: song.user.username,
        profileImageUrl: song.user.profile_image || null,
      };
      const existing = tracksById.get(song.track_id);
      if (existing) {
        const listeners = existing.sharedByList ?? [existing.sharedBy];
        if (!listeners.some((item) => item.id === listener.id)) {
          existing.sharedByList = [...listeners, listener];
        }
        return;
      }
      tracksById.set(song.track_id, {
        id: song.track_id,
        name: '',
        track: song.track_id,
        sharedBy: listener,
        sharedByList: [listener],
      });
    });
    return Array.from(tracksById.values());
  }, [data]);

  const questionDate =
    data?.yesterday_question?.question?.selected_dates?.[
      data.yesterday_question.question.selected_dates.length - 1
    ] ?? data?.yesterday_question?.question?.created_at;
  const missionDate = data?.yesterday_mission?.posts?.[0]?.created_at ?? questionDate;
  const todayQuestion = todayQuestions?.[0] ?? null;
  const shuffleSlot = getDigestShuffleSlot();

  const profileSuggestionCard = useMemo(() => {
    if (!myProfile) return null;
    const missingFields: ProfileSuggestionField[] = [];

    if (!myProfile.pronouns) {
      missingFields.push({ label: tProfileField('pronouns'), tab: 'pronouns_bio' });
    }
    if (!myProfile.bio) {
      missingFields.push({ label: tProfileField('bio'), tab: 'pronouns_bio' });
    }

    const chipsByCategory = myProfile.chips_by_category ?? {};
    const customChips = myProfile.custom_chips ?? [];
    chipCategories.forEach((cat) => {
      const hasStored = (chipsByCategory[cat.key] ?? []).length > 0;
      const hasCustom = customChips.some((chip) => chip.category === cat.key);
      if (!hasStored && !hasCustom) {
        missingFields.push({ label: cat.label, tab: 'interests' });
      }
    });

    if (!myProfile.profile_image) missingFields.push({ label: tProfileField('profile_photo') });

    if (missingFields.length === 0) return null;
    return { missingFields };
  }, [myProfile, chipCategories, tProfileField]);

  const feedItems = useMemo<DigestFeedItem[]>(() => {
    if (!data) return [];

    const postItems: DigestFeedItem[] = data.recommended_posts.map((post) => ({
      type: 'post',
      post,
    }));

    // derive a single window seed so all randomness (card order, interleave, legacy placement)
    // is stable for the entire 6-hour slot defined by `shuffleSlot`.
    const windowKeyParts = [
      'digest-window',
      shuffleSlot,
      // include a per-user identifier so different users get different stable orders
      myProfile?.id ?? myProfile?.username ?? 'anon',
    ];
    const windowSeed = hashString(windowKeyParts.join('|'));

    // prepare legacy cards (today question, profile suggestion)
    const legacyCards: DigestFeedItem[] = [];
    if (todayQuestion) {
      legacyCards.push({ type: 'today-question-card', question: todayQuestion });
    }
    if (profileSuggestionCard) {
      legacyCards.push({ type: 'profile-suggestion-card', suggestion: profileSuggestionCard });
    }

    // combine daily + legacy into one shuffled cards pool so their internal order is randomized
    const baseDailyCards = [
      { type: 'mission-card' },
      { type: 'question-card' },
      { type: 'music-card' },
    ] as DigestFeedItem[];
    const cardsPool: DigestFeedItem[] = shuffleWithSeed(
      [...baseDailyCards, ...legacyCards],
      windowSeed,
    );

    // prepare iteration state
    const result: DigestFeedItem[] = [];
    let postIndex = 0;
    let cardIndex = 0;

    // seed a random generator for deciding whether to insert 1 or 2 posts between cards
    // Use windowSeed so this decision stays fixed for the 6-hour window.
    const interleaveRand = seededRandom(windowSeed + 1);

    // 1) First item must be a card if available
    if (cardIndex < cardsPool.length) {
      result.push(cardsPool[cardIndex]);
      cardIndex += 1;
    } else if (postIndex < postItems.length) {
      result.push(postItems[postIndex]);
      postIndex += 1;
    }

    // 2) Alternate placing posts (1-2) and cards until card pool exhausted
    while (cardIndex < cardsPool.length) {
      // decide how many posts to insert (1 or 2) if posts remain
      const postsRemaining = postItems.length - postIndex;
      let numPostsToInsert = 0;
      if (postsRemaining > 0) {
        if (postsRemaining >= 2) {
          numPostsToInsert = interleaveRand() < 0.5 ? 1 : 2;
        } else {
          numPostsToInsert = 1;
        }
      }

      for (let i = 0; i < numPostsToInsert && postIndex < postItems.length; i += 1) {
        result.push(postItems[postIndex]);
        postIndex += 1;
      }

      // push the next card from the shuffled pool (this may create consecutive cards only when posts ran out)
      if (cardIndex < cardsPool.length) {
        result.push(cardsPool[cardIndex]);
        cardIndex += 1;
      }
    }

    // 3) After cards exhausted, append remaining posts
    if (postIndex < postItems.length) {
      result.push(...postItems.slice(postIndex));
    }

    return result;
  }, [data, profileSuggestionCard, shuffleSlot, todayQuestion, myProfile?.id, myProfile?.username]);

  if (isLoading) {
    return (
      <MainScrollContainer scrollRef={scrollRef}>
        <Container>
          <NoteLoader />
          <NoteLoader />
        </Container>
      </MainScrollContainer>
    );
  }

  if (!data) {
    return (
      <MainScrollContainer scrollRef={scrollRef}>
        <Container>
          <Typo type="body-medium" color="MEDIUM_GRAY" textAlign="center">
            {t('empty')}
          </Typo>
        </Container>
      </MainScrollContainer>
    );
  }

  return (
    <MainScrollContainer scrollRef={scrollRef}>
      <PullToRefresh onRefresh={handleRefresh}>
        <Container>
          <Banner>
            <Typo type="label-large" color="MEDIUM_GRAY" textAlign="center">
              {t('banner_title')}
            </Typo>
            {t('banner_subtitle') && (
              <Typo type="label-large" color="MEDIUM_GRAY" textAlign="center">
                {t('banner_subtitle')}
              </Typo>
            )}
          </Banner>

          <Layout.FlexCol w="100%" style={{ gap: 16 }}>
            {feedItems.map((item) => {
              switch (item.type) {
                case 'mission-card':
                  if (!data.yesterday_mission?.mission) return null;
                  return (
                    <DigestCard
                      key={`digest-mission-${data.yesterday_mission.mission.id}`}
                      $bg="linear-gradient(135deg, #8700FF 0%, #6200B3 100%)"
                    >
                      <Typo type="head-line" color="WHITE" bold>
                        {t('mission_title')}
                      </Typo>
                      <SectionIntro type="body-medium" color="WHITE">
                        {t('mission_description')}
                      </SectionIntro>
                      <MissionPromptBlock>
                        <ProfileImage
                          imageUrl="/whoami-profile.svg"
                          username="Whoami Today"
                          size={34}
                        />
                        <QuestionTextCol>
                          <PromptMetaRow>
                            <Typo type="label-medium" color="MEDIUM_GRAY">
                              {formatFullDate(missionDate)}
                            </Typo>
                            <Typo type="label-medium" color="MEDIUM_GRAY">
                              ·
                            </Typo>
                            <Typo type="label-medium" color="PRIMARY">
                              ✦ {t('mission_badge')}
                            </Typo>
                          </PromptMetaRow>
                          <Typo type="body-medium" color="BLACK">
                            {data.yesterday_mission.mission.prompt}
                          </Typo>
                        </QuestionTextCol>
                      </MissionPromptBlock>
                      <ViewAllButton
                        $color={Colors.BLACK}
                        onClick={() => {
                          const ctaUrl = data.yesterday_mission?.mission.cta_url;
                          if (ctaUrl) {
                            navigate(ctaUrl);
                            return;
                          }
                          navigate(`/missions/${data.yesterday_mission?.mission.id}?discover=true`);
                        }}
                      >
                        {data.yesterday_mission.mission.cta_label || t('view_mission_posts')}
                      </ViewAllButton>
                    </DigestCard>
                  );
                case 'question-card':
                  if (!data.yesterday_question?.question) return null;
                  return (
                    <DigestCard
                      key={`digest-question-${data.yesterday_question.question.id}`}
                      $bg={Colors.SECONDARY}
                    >
                      <Typo type="head-line" color="BLACK" bold>
                        {t('question_title')}
                      </Typo>
                      <SectionIntro type="body-medium" color="BLACK">
                        {t('question_description')}
                      </SectionIntro>
                      <QuestionPromptBlock>
                        <ProfileImage
                          imageUrl="/whoami-profile.svg"
                          username="Whoami Today"
                          size={34}
                        />
                        <QuestionTextCol>
                          <PromptMetaRow>
                            <Typo type="label-medium" color="MEDIUM_GRAY">
                              {formatFullDate(questionDate)}
                            </Typo>
                            <Typo type="label-medium" color="MEDIUM_GRAY">
                              ·
                            </Typo>
                            <PostTypeTag variant="question" />
                          </PromptMetaRow>
                          <Typo type="body-medium" color="BLACK">
                            {data.yesterday_question.question.content}
                          </Typo>
                        </QuestionTextCol>
                      </QuestionPromptBlock>
                      <ViewAllButton
                        $color={Colors.BLACK}
                        onClick={() =>
                          navigate(
                            `/questions/${data.yesterday_question?.question.id}?discover=true`,
                          )
                        }
                      >
                        {t('view_question_responses')}
                      </ViewAllButton>
                    </DigestCard>
                  );
                case 'music-card':
                  return (
                    <MusicBand key="digest-music">
                      <MusicHeader>
                        <Typo type="head-line" color="WHITE" bold>
                          {t('music_title')}
                        </Typo>
                        <Typo type="body-medium" color="WHITE" mt={4}>
                          {t('music_description')}
                        </Typo>
                      </MusicHeader>
                      <SharedPlaylistSection tracks={musicTracks} />
                    </MusicBand>
                  );
                case 'today-question-card': {
                  const todayQuestionDate =
                    item.question.selected_dates?.[item.question.selected_dates.length - 1] ??
                    item.question.created_at;
                  return (
                    <HighlightQuestionSection
                      key={`today-question-${item.question.id}`}
                      questionId={item.question.id}
                      question={item.question.content}
                      date={todayQuestionDate}
                      tag={t('today_question_tag')}
                    />
                  );
                }
                case 'profile-suggestion-card':
                  return (
                    <ProfileSuggestionCard
                      key={`profile-suggestion-${item.suggestion.missingFields
                        .map((field) => field.label)
                        .join('-')}`}
                      suggestion={item.suggestion}
                    />
                  );
                case 'post':
                  if (item.post.type === POST_TYPE.MISSION_GROUP) {
                    const group = item.post as MissionGroupItemModel;
                    return (
                      <MissionGroupItemComponent
                        key={`rec-mission-${group.mission_id ?? group.attempts[0]?.id}`}
                        group={group}
                        displayType="LIST"
                      />
                    );
                  }
                  if ('question' in item.post) {
                    return (
                      <ResponseItem
                        key={`rec-response-${item.post.id}`}
                        response={item.post}
                        displayType="LIST"
                        hideTimestamp
                        showMutualCounts
                      />
                    );
                  }
                  return (
                    <NoteItem
                      key={`rec-note-${(item.post as Note).id}`}
                      note={item.post as Note}
                      isMyPage={false}
                      hideTimestamp
                      showMutualCounts
                    />
                  );
                default:
                  return null;
              }
            })}
          </Layout.FlexCol>
        </Container>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default DiscoverW;
