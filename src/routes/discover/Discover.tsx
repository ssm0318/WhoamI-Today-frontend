import { useCallback, useEffect, useState } from 'react';
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
import NoteLoader from '@components/note/note-loader/NoteLoader';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { SCREEN_WIDTH } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useSaveAndHide } from '@hooks/useSaveAndHide';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { DiscoverFilter, DiscoverFilterLabel, DiscoverResultItem } from '@models/discover';
import { PlaylistSong } from '@models/playlist';
import { getDiscoverFeed } from '@utils/apis/discover';
import { getMe } from '@utils/apis/my';
import { getPlaylistFeed } from '@utils/apis/playlist';
import { MainScrollContainer } from 'src/routes/Root';
import * as S from './Discover.styled';

function Discover() {
  const [t] = useTranslation('translation');
  const [selectedFilter, setSelectedFilter] = useState<DiscoverFilter[]>([]);
  const [playlistTracks, setPlaylistTracks] = useState<SharedTrack[]>([]);
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(true);
  const {
    isSaved: isPersonaSaved,
    showCard: showPersonaCard,
    isAnimating: isPersonaAnimating,
    handleSave: handlePersonaSave,
  } = useSaveAndHide();

  const fetchPlaylistFeed = useCallback(async () => {
    try {
      setIsPlaylistLoading(true);
      const songs = await getPlaylistFeed();
      const transformedTracks: SharedTrack[] = songs.map((song: PlaylistSong) => ({
        id: song.id,
        name: '',
        track: song.track_id,
        sharedBy: {
          id: song.user.id,
          username: song.user.username,
          profileImageUrl: song.user.profile_image || null,
        },
      }));
      setPlaylistTracks(transformedTracks);
    } catch {
      setPlaylistTracks([]);
    } finally {
      setIsPlaylistLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylistFeed();
  }, [fetchPlaylistFeed]);

  const discoverFilterList = [DiscoverFilter.MUTUAL_FRIENDS, DiscoverFilter.MUTUAL_TRAITS];
  const { scrollRef } = useRestoreScrollPosition('discoverPage');

  // Build query string with filters
  const filterQuery = selectedFilter.length > 0 ? `?filter=${selectedFilter.join(',')}` : '';
  const swrKey = `/user/discover/${filterQuery}`;

  const {
    targetRef,
    data: discoverData,
    isLoadingMore,
    isLoading,
    mutate,
  } = useSWRInfiniteScroll<DiscoverResultItem>({ key: swrKey });

  const handleRefresh = useCallback(async () => {
    await Promise.all([getDiscoverFeed(null, selectedFilter), getMe(), fetchPlaylistFeed()]);
    mutate();
  }, [mutate, selectedFilter, fetchPlaylistFeed]);

  const renderDiscoverItem = useCallback(
    (item: DiscoverResultItem, index: number) => {
      switch (item.type) {
        case 'Response':
          return <ResponseItem key={`response-${item.body.id}`} response={item.body} />;
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
          return (
            <SelectInterestSection
              key={`interest-${index}`}
              interestList={item.body.list}
              isSaved={item.body.list.every((interest) => interest.is_selected)}
            />
          );
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
    [isPersonaSaved, showPersonaCard, handlePersonaSave, isPersonaAnimating],
  );

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
            {!isPlaylistLoading && <SharedPlaylistSection tracks={playlistTracks} />}

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
              ) : discoverData?.[0] &&
                discoverData[0].results &&
                discoverData[0].results.length > 0 ? (
                <Layout.FlexCol gap={20} mh={16}>
                  {discoverData.map((page) =>
                    page.results?.map((item, index) => renderDiscoverItem(item, index)),
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
