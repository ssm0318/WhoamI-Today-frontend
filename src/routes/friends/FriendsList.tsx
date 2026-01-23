import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import FriendItemWithUpdates from '@components/friends/friend-item-with-updates/FriendItemWithUpdates';
import FriendTypeChip from '@components/friends/friend-type-chip/FriendTypeChip';
import NoCloseFriends from '@components/friends/no-close-friends/NoCloseFriends';
import SharedPlaylistSection, {
  SharedTrack,
} from '@components/friends/shared-playlist/SharedPlaylistSection';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import { BOTTOM_TABBAR_HEIGHT, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { FriendType } from '@models/api/friends';
import { SocialBattery } from '@models/checkIn';
import { PlaylistSong } from '@models/playlist';
import { getMe } from '@utils/apis/my';
import { getPlaylistFeed } from '@utils/apis/playlist';
import { MainScrollContainer } from 'src/routes/Root';
import useInfiniteFetchFriends from '../../hooks/useInfiniteFetchFriends';
import { AllFriendItemLoader, AllFriendListLoader } from './FriendsLoader';

function FriendsList() {
  const [selectedType, setSelectedType] = useState<FriendType>('all');
  const [playlistTracks, setPlaylistTracks] = useState<SharedTrack[]>([]);
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(true);

  const { targetRef, allFriends, isAllFriendsLoading, isLoadingMoreAllFriends, refetchAllFriends } =
    useInfiniteFetchFriends({ type: selectedType });

  const fetchPlaylistFeed = async () => {
    try {
      setIsPlaylistLoading(true);
      const songs = await getPlaylistFeed();
      const transformedTracks: SharedTrack[] = songs.map((song: PlaylistSong) => ({
        id: song.id,
        name: '', // Will be filled by Spotify API in TrackCardItem
        track: song.track_id,
        sharedBy: {
          id: song.user.id,
          username: song.user.username,
          profileImageUrl: song.user.profile_image || null,
        },
      }));
      setPlaylistTracks(transformedTracks);
    } catch (error) {
      console.error('Error fetching playlist feed:', error);
      setPlaylistTracks([]);
    } finally {
      setIsPlaylistLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistFeed();
  }, []);

  const handleRefresh = async () => {
    await Promise.all([refetchAllFriends(), getMe(), fetchPlaylistFeed()]);
  };

  const { scrollRef } = useRestoreScrollPosition('friendsPage');

  const { filteredFriends } = useMemo(() => {
    if (!allFriends) {
      return { filteredFriends: [] };
    }

    const allFriendsList = allFriends
      .flatMap(({ results }) => results || [])
      .filter((user) => !user.is_hidden);

    // API에서 이미 필터링된 데이터를 받으므로 클라이언트 사이드 필터링 불필요
    const filtered = allFriendsList;

    return {
      allFriendsCount: allFriendsList.length,
      filteredFriends: filtered,
    };
  }, [allFriends]);

  const isEmpty = filteredFriends.length === 0 && !isAllFriendsLoading;

  return (
    <MainScrollContainer scrollRef={scrollRef} showNotificationPermission>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%" pb={FLOATING_BUTTON_SIZE + 20} h={isEmpty ? '100%' : undefined}>
          {/* All Friends */}
          <Layout.FlexCol w="100%" flex={isEmpty ? 1 : undefined}>
            {/* All Friends / Close Friends 필터 */}
            <Layout.FlexRow gap={8} ph={16} pv={12}>
              <FriendTypeChip
                type="all"
                isSelected={selectedType === 'all'}
                // count={allFriendsCount}
                onClick={() => setSelectedType('all')}
              />
              <FriendTypeChip
                type="close_friends"
                isSelected={selectedType === 'close_friends'}
                onClick={() => setSelectedType('close_friends')}
              />
            </Layout.FlexRow>

            {/* Shared Playlist 섹션 */}
            {!isPlaylistLoading && (
              <SharedPlaylistSection
                tracks={playlistTracks}
                onTrackAdded={fetchPlaylistFeed}
                onTrackDeleted={fetchPlaylistFeed}
              />
            )}

            <EmptyStateContainer isEmpty={isEmpty}>
              {isAllFriendsLoading ? (
                <AllFriendListLoader />
              ) : filteredFriends.length > 0 ? (
                <>
                  {/* 친구 목록 */}
                  <Layout.FlexCol w="100%" gap={12}>
                    {filteredFriends.map((user) => (
                      <FriendItemWithUpdates
                        user={{
                          ...user,
                          social_battery: SocialBattery.completely_drained,
                        }}
                        key={user.id}
                        recentPost={user.recent_post}
                      />
                    ))}
                  </Layout.FlexCol>
                  <div ref={targetRef} />
                  {isLoadingMoreAllFriends && <AllFriendItemLoader />}
                </>
              ) : selectedType === 'close_friends' ? (
                <NoCloseFriends />
              ) : null}
            </EmptyStateContainer>
          </Layout.FlexCol>
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

const EmptyStateContainer = styled(Layout.FlexCol)<{ isEmpty: boolean }>`
  width: 100%;
  padding: 8px 0;
  ${({ isEmpty }) =>
    isEmpty &&
    `
    flex: 1;
    justify-content: center;
    min-height: calc(100vh - ${TOP_NAVIGATION_HEIGHT}px - ${BOTTOM_TABBAR_HEIGHT}px - 60px);
  `}
`;

export default FriendsList;
