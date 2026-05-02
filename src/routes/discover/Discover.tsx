import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import useSWR from 'swr';
import FilterChip from '@components/_common/filter-chip/FilterChip';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import HighlightQuestionSection from '@components/discover/HighlightQuestionSection/HighlightQuestionSection';
import ProfileSuggestionCard from '@components/discover/ProfileSuggestionCard/ProfileSuggestionCard';
import SelectInterestSection from '@components/discover/SelectInterestSection/SelectInterestSection';
import SelectPersonaSection from '@components/discover/SelectPersonaSection/SelectPersonaSection';
import SurveyResultsCard from '@components/discover/SurveyResultsCard/SurveyResultsCard';
import UsernameSuggestionCard from '@components/discover/UsernameSuggestionCard/UsernameSuggestionCard';
import SharedPlaylistSection, {
  SharedTrack,
} from '@components/friends/shared-playlist/SharedPlaylistSection';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import NoteItem from '@components/note/note-item/NoteItem';
import NoteLoader from '@components/note/note-loader/NoteLoader';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { useChipCategories } from '@hooks/useChipCategories';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useSaveAndHide } from '@hooks/useSaveAndHide';
import { useScrollDepth } from '@hooks/useScrollDepth';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { useTrackEvent } from '@hooks/useTrackEvent';
import i18n from '@i18n/index';
import {
  DiscoverFilter,
  DiscoverFilterLabel,
  DiscoverMusicTrack,
  DiscoverResultItem,
  ProfileSuggestionField,
} from '@models/discover';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getDiscoverFeed } from '@utils/apis/discover';
import { getMe } from '@utils/apis/my';
import { getPastSurveys } from '@utils/apis/survey';
import { getItemFromSessionStorage, setItemToSessionStorage } from '@utils/sessionStorage';
import { MainScrollContainer } from 'src/routes/Root';
import * as S from './Discover.styled';

function getLocalRefreshTime(): string {
  const now = new Date();
  const laHourStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    hour12: false,
  }).format(now);
  const laHour = parseInt(laHourStr, 10);
  const localHour = now.getHours();
  let diff = localHour - laHour;
  if (diff > 12) diff -= 24;
  if (diff < -12) diff += 24;
  const refreshHour = (7 + diff + 24) % 24;

  const refDate = new Date();
  refDate.setHours(refreshHour, 0, 0, 0);
  return new Intl.DateTimeFormat(i18n.language === 'ko' ? 'ko-KR' : 'en-US', {
    hour: 'numeric',
    hour12: true,
  }).format(refDate);
}

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

  // If a browse mode is active and it hides Discover, redirect to the first allowed tab.
  // Prevents the user landing here via direct URL while their session preferences hide it.
  // Computed early so we can decide before rendering, but we must still call every hook
  // below unconditionally to satisfy the Rules of Hooks — the `Navigate` is returned at
  // the end of this component's body, after all hooks have run.
  const activeBrowseMode = useBoundStore((state) => state.activeBrowseMode);
  const allowedTabs = activeBrowseMode?.config.tabs;
  const discoverHidden = !!allowedTabs && !allowedTabs.includes('discover');
  const fallbackPath = allowedTabs && allowedTabs.length > 0 ? `/${allowedTabs[0]}` : '/friends';

  const discoverFilterList = [DiscoverFilter.MUTUAL_FRIENDS, DiscoverFilter.MUTUAL_TRAITS];
  const { scrollRef } = useRestoreScrollPosition('discoverPage');
  // Discover is a feed — depth telegraphs engagement intensity. Backend
  // sees pagination requests but can't tell if a user actually read past
  // the items it loaded.
  useScrollDepth('discover_scroll', scrollRef);
  const trackEvent = useTrackEvent();

  // SWR key is version-aware — Q users hit /api/q/user/discover/
  const swrKey = isVerQ ? '/q/user/discover/' : '/user/discover/';

  const {
    targetRef,
    data: discoverData,
    isLoadingMore,
    isLoading,
    isEndPage,
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

  const { categories: chipCategories } = useChipCategories();

  const profileSuggestionCard: DiscoverResultItem | null = useMemo(() => {
    if (!myProfile) return null;
    const missingFields: ProfileSuggestionField[] = [];

    if (!myProfile.pronouns) missingFields.push({ label: 'Pronouns', tab: 'pronouns_bio' });
    if (!myProfile.bio) missingFields.push({ label: 'Bio', tab: 'pronouns_bio' });

    // One chip per chip-category the user hasn't filled — `chips_by_category` plus user-created
    // `custom_chips` together represent everything the Interests tab tracks. The legacy
    // `user_personas` field is intentionally ignored: persona is now the `online_persona`
    // chip category, not a separate concept.
    const chipsByCategory = myProfile.chips_by_category ?? {};
    const customChips = myProfile.custom_chips ?? [];
    chipCategories.forEach((cat) => {
      const hasStored = (chipsByCategory[cat.key] ?? []).length > 0;
      const hasCustom = customChips.some((c) => c.category === cat.key);
      if (!hasStored && !hasCustom) {
        missingFields.push({ label: cat.label, tab: 'interests' });
      }
    });

    if (!myProfile.profile_image) missingFields.push({ label: 'Profile Photo' });

    if (missingFields.length === 0) return null;
    return {
      type: 'ProfileSuggestion' as const,
      body: { missingFields },
    };
  }, [myProfile, chipCategories]);

  const usernameSuggestionCard: DiscoverResultItem | null = useMemo(() => {
    if (!myProfile) return null;
    // Show only while the user is still on the placeholder username they were allocated at
    // signup (`username_history` is initialized to `[initialUsername]` and gets a new entry
    // appended every time the username is updated). Older accounts whose history was never
    // backfilled return undefined — treat that as "don't show" so we don't badger them.
    const history = myProfile.username_history;
    if (!history || history.length !== 1) return null;
    return {
      type: 'UsernameSuggestion' as const,
      body: { currentUsername: myProfile.username },
    };
  }, [myProfile]);

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

    // Show every eligible synthetic card — username and profile-completion prompts
    // disappear on their own once the user fills the corresponding fields, so
    // rotating them across days hides actionable nudges instead of helping.
    const selectedCards = (
      [surveyResultsCard, profileSuggestionCard, usernameSuggestionCard] as const
    ).filter((c) => c !== null) as DiscoverResultItem[];

    const result: DiscoverResultItem[] = [...flatItems];
    // Inject at positions 3, 7, 11, … so a card always appears between feed items.
    selectedCards
      .map((card, i) => ({ position: 3 + i * 4, card }))
      .sort((a, b) => b.position - a.position)
      .forEach(({ position, card }) => {
        const insertAt = Math.min(position, result.length);
        result.splice(insertAt, 0, card);
      });

    return result;
  }, [discoverData, profileSuggestionCard, surveyResultsCard, usernameSuggestionCard]);

  // If the active browse mode says to hide synthetic discover cards, drop them here.
  const hideSyntheticCards = !!activeBrowseMode?.config.sections.hide_synthetic_discover_cards;

  // Client-side filtering by category
  const filterItem = useCallback(
    (item: DiscoverResultItem): boolean => {
      // Synthetic cards: shown by default, hidden when the active browse mode says so.
      if (
        item.type === 'ProfileSuggestion' ||
        item.type === 'SurveyResults' ||
        item.type === 'UsernameSuggestion'
      ) {
        return !hideSyntheticCards;
      }
      if (selectedFilter.length === 0) return true;
      // When a filter is active, only show Response/Note items matching the category
      if (item.type !== 'Response' && item.type !== 'Note') return false;
      return selectedFilter.includes(item.category as DiscoverFilter);
    },
    [selectedFilter, hideSyntheticCards],
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
        case 'ProfileSuggestion':
          return (
            <ProfileSuggestionCard key={`profile-suggestion-${index}`} suggestion={item.body} />
          );
        case 'SurveyResults':
          return <SurveyResultsCard key={`survey-results-${index}`} card={item.body} />;
        case 'UsernameSuggestion':
          return (
            <UsernameSuggestionCard key={`username-suggestion-${index}`} suggestion={item.body} />
          );
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

  if (discoverHidden) {
    return <Navigate to={fallbackPath} replace />;
  }

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
                    const wasSelected = selectedFilter.includes(filter);
                    // Filter state is purely client — backend's
                    // /discover/feed/ call doesn't carry it. This event
                    // is the only signal of which chips users actually
                    // engage with.
                    trackEvent('discover_filter_chip_toggled', {
                      filter: String(filter),
                      value: wasSelected ? 'off' : 'on',
                    });
                    if (wasSelected) {
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

          {!isVerQ && !isLoading && (
            <Layout.FlexCol w="100%" ph={16} pv={8} mb={8} alignItems="center">
              <Typo type="label-large" color="MEDIUM_GRAY" textAlign="center">
                {t('discover_banner.daily_refresh_1', { time: getLocalRefreshTime() })}
              </Typo>
              <Typo type="label-large" color="MEDIUM_GRAY" textAlign="center">
                {t('discover_banner.daily_refresh_2')}
              </Typo>
            </Layout.FlexCol>
          )}

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
                  {/* Keep sentinel mounted for filtered-empty states so pagination can continue. */}
                  {feedWithInjections.length > 0 && !isEndPage && <div ref={targetRef} />}
                  {isLoadingMore && <NoteLoader />}
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
