import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterChip from '@components/_common/filter-chip/FilterChip';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import HighlightQuestionSection from '@components/discover/HighlightQuestionSection/HighlightQuestionSection';
import SelectInterestSection from '@components/discover/SelectInterestSection/SelectInterestSection';
import SelectPersonaSection from '@components/discover/SelectPersonaSection/SelectPersonaSection';
import SharedPlaylistSection, {
  SharedTrack,
} from '@components/friends/shared-playlist/SharedPlaylistSection';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import NoteItem from '@components/note/note-item/NoteItem';
import NoteLoader from '@components/note/note-loader/NoteLoader';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { SCREEN_WIDTH } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useSaveAndHide } from '@hooks/useSaveAndHide';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import {
  DiscoverFilter,
  DiscoverFilterLabel,
  DiscoverMusicTrack,
  DiscoverResultItem,
} from '@models/discover';
import { getDiscoverFeed } from '@utils/apis/discover';
import { getMe } from '@utils/apis/my';
import { MainScrollContainer } from 'src/routes/Root';
import * as S from './Discover.styled';

function Discover() {
  const [t] = useTranslation('translation');
  const [selectedFilter, setSelectedFilter] = useState<DiscoverFilter[]>([]);
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

  const discoverFilterList = [DiscoverFilter.MUTUAL_FRIENDS, DiscoverFilter.MUTUAL_TRAITS];
  const { scrollRef } = useRestoreScrollPosition('discoverPage');

  // SWR key is stable — filtering is done client-side to avoid refetch issues
  const swrKey = '/user/discover/';

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

  // Client-side filtering by category
  const filterItem = useCallback(
    (item: DiscoverResultItem): boolean => {
      if (selectedFilter.length === 0) return true;
      // When a filter is active, only show Response/Note items matching the category
      if (item.type !== 'Response' && item.type !== 'Note') return false;
      return selectedFilter.includes(item.category as DiscoverFilter);
    },
    [selectedFilter],
  );

  const handleRefresh = useCallback(async () => {
    await Promise.all([getDiscoverFeed(null), getMe()]);
    mutate();
  }, [mutate]);

  const renderDiscoverItem = useCallback(
    (item: DiscoverResultItem, index: number) => {
      switch (item.type) {
        case 'Response':
          return (
            <ResponseItem
              key={`response-${item.body.id}`}
              response={item.body}
              displayType="FEED"
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
              tag={item.body.is_admin_question ? 'Highlight' : 'Question'}
            />
          );
        case 'Interest':
          return showInterestCard ? (
            <S.AnimatedCardWrapper key={`interest-${index}`} $isAnimating={isInterestAnimating}>
              <SelectInterestSection
                key={`interest-${index}`}
                interestList={item.body.list}
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
    ],
  );

  // Check if there are any visible items after filtering
  const hasVisibleItems = useMemo(() => {
    if (!discoverData) return false;
    return discoverData.some((page) =>
      page.results?.some((item) => filterItem(item) && renderDiscoverItem(item, 0) !== null),
    );
  }, [discoverData, filterItem, renderDiscoverItem]);

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
        <PullToRefresh onRefresh={handleRefresh}>
          <Layout.FlexCol w="100%" pb={FLOATING_BUTTON_SIZE + 20}>
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

            {/* Shared Playlist */}
            {!isLoading && <SharedPlaylistSection tracks={musicTracks} />}

            {/* Discover Feed */}
            <Layout.FlexCol gap={20} mh={20} alignItems="center" w={SCREEN_WIDTH - 40}>
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
                  {discoverData?.map((page) =>
                    page.results
                      ?.filter(filterItem)
                      .map((item, index) => renderDiscoverItem(item, index)),
                  )}
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
          </Layout.FlexCol>
        </PullToRefresh>
      </MainScrollContainer>
    </>
  );
}

export default Discover;
