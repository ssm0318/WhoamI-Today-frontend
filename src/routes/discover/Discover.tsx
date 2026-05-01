import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import FilterChip from '@components/_common/filter-chip/FilterChip';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import HighlightQuestionSection from '@components/discover/HighlightQuestionSection/HighlightQuestionSection';
import MissionPromptCard from '@components/discover/MissionPromptCard/MissionPromptCard';
import MusicHighlightCard from '@components/discover/MusicHighlightCard/MusicHighlightCard';
import ProfileSuggestionCard from '@components/discover/ProfileSuggestionCard/ProfileSuggestionCard';
import SelectInterestSection from '@components/discover/SelectInterestSection/SelectInterestSection';
import SelectPersonaSection from '@components/discover/SelectPersonaSection/SelectPersonaSection';
import SurveyResultsCard from '@components/discover/SurveyResultsCard/SurveyResultsCard';
import SharedPlaylistSection, {
  SharedTrack,
} from '@components/friends/shared-playlist/SharedPlaylistSection';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import NoteItem from '@components/note/note-item/NoteItem';
import NoteLoader from '@components/note/note-loader/NoteLoader';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { getDayOfYear } from '@components/share/MissionOfTheDay';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { useMissions } from '@hooks/useMissions';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useSaveAndHide } from '@hooks/useSaveAndHide';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import {
  DiscoverFilter,
  DiscoverFilterLabel,
  DiscoverMusicTrack,
  DiscoverResultItem,
} from '@models/discover';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getDiscoverFeed } from '@utils/apis/discover';
import { getMe } from '@utils/apis/my';
import { getPastSurveys } from '@utils/apis/survey';
import { getItemFromSessionStorage, setItemToSessionStorage } from '@utils/sessionStorage';
import { MainScrollContainer } from 'src/routes/Root';
import * as S from './Discover.styled';

function Discover() {
  const [t] = useTranslation('translation');
  const DISCOVER_FILTER_KEY = 'WHOAMI_TODAY_DISCOVER_FILTER';
  const [selectedFilter, setSelectedFilter] = useState<DiscoverFilter[]>(
    () => getItemFromSessionStorage<DiscoverFilter[]>(DISCOVER_FILTER_KEY, []) ?? [],
  );

  useEffect(() => {
    setItemToSessionStorage(DISCOVER_FILTER_KEY, selectedFilter);
  }, [selectedFilter]);

  const {
    isSaved: isInterestSaved,
    showCard: showInterestCard,
    isAnimating: isInterestAnimating,
    handleSave: handleInterestSave,
  } = useSaveAndHide();
  const {
    isSaved: isPersonaSaved,
    showCard: showPersonaCard,
    isAnimating: isPersonaAnimating,
    handleSave: handlePersonaSave,
  } = useSaveAndHide();

  const myProfile = useBoundStore((state) => state.myProfile);
  const { featureFlags } = useBoundStore(UserSelector);
  const isVerQ = !!featureFlags?.postsVerQ;

  const { missions } = useMissions();
  const discoverFilterList = [DiscoverFilter.MUTUAL_FRIENDS, DiscoverFilter.MUTUAL_TRAITS];
  const { scrollRef } = useRestoreScrollPosition('discoverPage');

  // SWR key is version-aware — Q users hit /api/q/user/discover/
  const swrKey = isVerQ ? '/q/user/discover/' : '/user/discover/';

  const {
    targetRef,
    data: discoverData,
    isLoadingMore,
    isLoading,
    mutate,
  } = useSWRInfiniteScroll<DiscoverResultItem>({ key: swrKey });

  // Extract music tracks from the first page of the discover API response
  const musicTracks: SharedTrack[] = useMemo(() => {
    const firstPage = discoverData?.[0] as Record<string, unknown> | undefined;
    const tracks = (firstPage?.music_tracks ?? []) as DiscoverMusicTrack[];
    return tracks.map((song) => ({
      id: song.id,
      name: '',
      track: song.track_id,
      sharedBy: {
        id: song.user.id,
        username: song.user.username,
        profileImageUrl: song.user.profile_image || null,
      },
    }));
  }, [discoverData]);

  // Build synthetic cards to inject into the feed
  const missionPromptCard: DiscoverResultItem | null = useMemo(() => {
    const todayMission = missions[getDayOfYear() % missions.length];
    return {
      type: 'MissionPrompt' as const,
      body: { prompt: todayMission.prompt, missionType: todayMission.type },
    };
  }, [missions]);

  const profileSuggestionCard: DiscoverResultItem | null = useMemo(() => {
    if (!myProfile) return null;
    const missingFields: string[] = [];
    if (!myProfile.pronouns) missingFields.push('Pronouns');
    if (!myProfile.user_interests || myProfile.user_interests.length === 0)
      missingFields.push('Interests');
    if (!myProfile.user_personas || myProfile.user_personas.length === 0)
      missingFields.push('Personas');
    if (!myProfile.profile_image) missingFields.push('Profile Photo');
    if (missingFields.length === 0) return null;
    return {
      type: 'ProfileSuggestion' as const,
      body: { missingFields },
    };
  }, [myProfile]);

  const musicHighlightCard: DiscoverResultItem | null = useMemo(() => {
    if (musicTracks.length === 0) return null;
    const randomTrack = musicTracks[getDayOfYear() % musicTracks.length];
    const trackId = typeof randomTrack.track === 'string' ? randomTrack.track : null;
    if (!trackId) return null;
    return {
      type: 'MusicHighlight' as const,
      body: { trackId, sharedByUsername: randomTrack.sharedBy.username },
    };
  }, [musicTracks]);

  const { data: pastSurveysData } = useSWR('/surveys/past/', getPastSurveys, {
    revalidateOnFocus: false,
  });
  const surveyResultsCard: DiscoverResultItem | null = useMemo(() => {
    const unlocked = pastSurveysData?.results?.find((row) => row.results_unlocked);
    if (!unlocked) return null;
    return {
      type: 'SurveyResults' as const,
      body: {
        slug: unlocked.survey.slug,
        titleEn: unlocked.survey.title_en,
        titleKo: unlocked.survey.title_ko,
        date: unlocked.date,
      },
    };
  }, [pastSurveysData]);

  // Inject synthetic cards at specific positions in the flattened feed
  const feedWithInjections = useMemo(() => {
    if (!discoverData) return [];
    // Flatten all pages into a single list
    const flatItems: DiscoverResultItem[] = [];
    discoverData.forEach((page) => {
      if (page.results) flatItems.push(...page.results);
    });

    // Pick at most 2 injected cards per day (rotate daily)
    const allCards = (
      [surveyResultsCard, missionPromptCard, profileSuggestionCard, musicHighlightCard] as const
    ).filter((c) => c !== null) as DiscoverResultItem[];
    const dayOfYear = getDayOfYear();
    const selectedCards =
      allCards.length <= 2
        ? allCards
        : [
            allCards[dayOfYear % allCards.length],
            allCards[(dayOfYear + 1) % allCards.length],
          ].filter((card, i, arr) => arr.indexOf(card) === i);

    const result: DiscoverResultItem[] = [...flatItems];
    // Insert selected cards at positions 3, 7
    selectedCards
      .map((card, i) => ({ position: 3 + i * 4, card }))
      .sort((a, b) => b.position - a.position)
      .forEach(({ position, card }) => {
        const insertAt = Math.min(position, result.length);
        result.splice(insertAt, 0, card);
      });

    return result;
  }, [
    discoverData,
    missionPromptCard,
    profileSuggestionCard,
    musicHighlightCard,
    surveyResultsCard,
  ]);

  // Client-side filtering by category
  const filterItem = useCallback(
    (item: DiscoverResultItem): boolean => {
      // Always show injected synthetic cards
      if (
        item.type === 'MissionPrompt' ||
        item.type === 'ProfileSuggestion' ||
        item.type === 'MusicHighlight' ||
        item.type === 'SurveyResults'
      ) {
        return true;
      }
      if (selectedFilter.length === 0) return true;
      // When a filter is active, only show Response/Note items matching the category
      if (item.type !== 'Response' && item.type !== 'Note') return false;
      return selectedFilter.includes(item.category as DiscoverFilter);
    },
    [selectedFilter],
  );

  const handleRefresh = useCallback(async () => {
    const apiPrefix = isVerQ ? 'q/' : '';
    await Promise.all([getDiscoverFeed(null, apiPrefix), getMe()]);
    mutate();
  }, [mutate, isVerQ]);

  const renderDiscoverItem = useCallback(
    (item: DiscoverResultItem, index: number) => {
      // VER_Q: only show Note/Response items, drop all injection cards
      if (isVerQ && item.type !== 'Note' && item.type !== 'Response') {
        return null;
      }
      switch (item.type) {
        case 'Response':
          return (
            <ResponseItem
              key={`response-${item.body.id}`}
              response={item.body}
              displayType="LIST"
            />
          );
        case 'Note':
          return <NoteItem key={`note-${item.body.id}`} note={item.body} isMyPage={false} />;
        case 'Question':
          return (
            <HighlightQuestionSection
              key={`question-${item.body.id}`}
              questionId={item.body.id}
              question={item.body.content}
              tag="Question of the Day"
            />
          );
        case 'Interest':
          return showInterestCard ? (
            <S.AnimatedCardWrapper key={`interest-${index}`} $isAnimating={isInterestAnimating}>
              <SelectInterestSection
                key={`interest-${index}`}
                categoryLabel={item.body.category_label}
                isSaved={isInterestSaved}
                onSave={handleInterestSave}
              />
            </S.AnimatedCardWrapper>
          ) : null;
        case 'Persona':
          return showPersonaCard ? (
            <S.AnimatedCardWrapper key={`persona-${index}`} $isAnimating={isPersonaAnimating}>
              <SelectPersonaSection
                personaList={item.body.list}
                isSaved={isPersonaSaved}
                onSave={handlePersonaSave}
              />
            </S.AnimatedCardWrapper>
          ) : null;
        case 'MissionPrompt':
          return <MissionPromptCard key={`mission-${index}`} mission={item.body} />;
        case 'ProfileSuggestion':
          return (
            <ProfileSuggestionCard key={`profile-suggestion-${index}`} suggestion={item.body} />
          );
        case 'MusicHighlight':
          return <MusicHighlightCard key={`music-highlight-${index}`} highlight={item.body} />;
        case 'SurveyResults':
          return <SurveyResultsCard key={`survey-results-${index}`} card={item.body} />;
        default:
          return null;
      }
    },
    [
      isInterestSaved,
      showInterestCard,
      handleInterestSave,
      isInterestAnimating,
      isPersonaSaved,
      showPersonaCard,
      handlePersonaSave,
      isPersonaAnimating,
      isVerQ,
    ],
  );

  // Check if there are any visible items after filtering
  const hasVisibleItems = useMemo(() => {
    if (feedWithInjections.length === 0) return false;
    return feedWithInjections.some(
      (item) => filterItem(item) && renderDiscoverItem(item, 0) !== null,
    );
  }, [feedWithInjections, filterItem, renderDiscoverItem]);

  return (
    <>
      <S.HideScrollbarGlobalStyle />
      <MainScrollContainer
        scrollRef={scrollRef}
        showNotificationPermission
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Filter + shared playlist sit outside ptr__children so WebView can pan horizontal lists. */}
        <Layout.FlexCol w="100%" pb={FLOATING_BUTTON_SIZE + 20}>
          {!isVerQ && (
            <S.ScrollableFilterRow gap={8} ph={16} pv={12}>
              {discoverFilterList.map((filter) => (
                <FilterChip
                  key={filter}
                  label={DiscoverFilterLabel[filter]}
                  isSelected={selectedFilter.includes(filter)}
                  onClick={() => {
                    if (selectedFilter.includes(filter)) {
                      setSelectedFilter(selectedFilter.filter((f) => f !== filter));
                    } else {
                      setSelectedFilter([...selectedFilter, filter]);
                    }
                  }}
                />
              ))}
            </S.ScrollableFilterRow>
          )}

          {!isVerQ && !isLoading && <SharedPlaylistSection tracks={musicTracks} />}

          <PullToRefresh onRefresh={handleRefresh}>
            <Layout.FlexCol
              gap={20}
              ph={DEFAULT_MARGIN}
              pt={isVerQ ? 12 : 0}
              alignItems="center"
              w="100%"
              style={{ boxSizing: 'border-box' }}
            >
              {isLoading ? (
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                    margin: '0 16px',
                  }}
                >
                  <NoteLoader />
                  <NoteLoader />
                </div>
              ) : hasVisibleItems ? (
                <Layout.FlexCol gap={20} w="100%">
                  {feedWithInjections
                    .filter(filterItem)
                    .map((item, index) => renderDiscoverItem(item, index))}
                  <div ref={targetRef} />
                  {isLoadingMore && <NoteLoader />}
                </Layout.FlexCol>
              ) : (
                <Layout.FlexCol
                  w="100%"
                  style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch' }}
                >
                  <div style={{ width: '100%', paddingTop: 20, textAlign: 'center' }}>
                    <Typo type="body-medium" color="MEDIUM_GRAY" textAlign="center">
                      {t('no_contents.discover')}
                    </Typo>
                  </div>
                </Layout.FlexCol>
              )}
            </Layout.FlexCol>
          </PullToRefresh>
        </Layout.FlexCol>
      </MainScrollContainer>
    </>
  );
}

export default Discover;
