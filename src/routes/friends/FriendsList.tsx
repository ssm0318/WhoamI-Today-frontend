import { useMemo, useState } from 'react';
import styled from 'styled-components';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import FriendItemWithUpdates from '@components/friends/friend-item-with-updates/FriendItemWithUpdates';
import FriendTypeChip from '@components/friends/friend-type-chip/FriendTypeChip';
import NoCloseFriends from '@components/friends/no-close-friends/NoCloseFriends';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import { Layout } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { Connection, FriendType } from '@models/api/friends';
import { getMe } from '@utils/apis/my';
import { MainScrollContainer } from 'src/routes/Root';
import useInfiniteFetchFriends from '../../hooks/useInfiniteFetchFriends';
import { AllFriendItemLoader, AllFriendListLoader } from './FriendsLoader';

function FriendsList() {
  const [selectedType, setSelectedType] = useState<FriendType>('all');

  const {
    targetRef,
    allFriends,
    isAllFriendsLoading,
    isLoadingMoreAllFriends,
    refetchAllFriends,
    updateFriendList,
  } = useInfiniteFetchFriends({ type: selectedType });

  // 다른 탭의 hook도 가져와서 함께 업데이트
  const allFriendsHook = useInfiniteFetchFriends({ type: 'all' });
  const closeFriendsHook = useInfiniteFetchFriends({ type: 'close_friends' });

  const handleRefresh = async () => {
    await Promise.all([refetchAllFriends(), getMe()]);
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

            {isAllFriendsLoading ? (
              <EmptyStateContainer isEmpty={isEmpty}>
                <AllFriendListLoader />
              </EmptyStateContainer>
            ) : filteredFriends.length > 0 ? (
              <EmptyStateContainer isEmpty={false}>
                {/* 친구 목록 */}
                <Layout.FlexCol w="100%" gap={12}>
                  {filteredFriends.map((user) => (
                    <FriendItemWithUpdates
                      user={user}
                      key={user.id}
                      recentPost={user.recent_post}
                      onConnectionChanged={(userId, connection) => {
                        // close_friends 탭에서 friend로 변경되면 목록에서 제거
                        if (selectedType === 'close_friends' && connection === Connection.FRIEND) {
                          updateFriendList({
                            type: 'break_friends',
                            item: user,
                          });
                          // all 탭의 connection_status도 업데이트
                          allFriendsHook.updateFriendList({
                            type: 'connection_status',
                            item: user,
                            value: connection,
                          });
                        } else {
                          // 현재 탭 업데이트
                          updateFriendList({
                            type: 'connection_status',
                            item: user,
                            value: connection,
                          });

                          // 다른 탭도 업데이트
                          if (selectedType === 'all') {
                            // all 탭에서 변경: close_friends 탭도 업데이트
                            if (connection === Connection.CLOSE_FRIEND) {
                              // close_friends 탭에 추가 또는 업데이트
                              const closeFriendsData = closeFriendsHook.allFriends;
                              if (closeFriendsData) {
                                const exists = closeFriendsData.some((page) =>
                                  page.results?.some((u) => u.id === userId),
                                );
                                if (!exists) {
                                  // 첫 페이지에 추가
                                  const firstPage = closeFriendsData[0];
                                  if (firstPage?.results) {
                                    const updatedFirstPage = {
                                      ...firstPage,
                                      count: (firstPage.count || 0) + 1,
                                      results: [
                                        { ...user, connection_status: Connection.CLOSE_FRIEND },
                                        ...firstPage.results,
                                      ],
                                    };
                                    closeFriendsHook.refetchAllFriends(
                                      [updatedFirstPage, ...closeFriendsData.slice(1)],
                                      { revalidate: false },
                                    );
                                  }
                                } else {
                                  // 이미 존재하면 connection_status만 업데이트
                                  closeFriendsHook.updateFriendList({
                                    type: 'connection_status',
                                    item: user,
                                    value: connection,
                                  });
                                }
                              }
                            } else {
                              // friend로 변경: close_friends 탭에서 제거
                              closeFriendsHook.updateFriendList({
                                type: 'break_friends',
                                item: user,
                              });
                            }
                          } else {
                            // close_friends 탭에서 변경: all 탭도 업데이트
                            allFriendsHook.updateFriendList({
                              type: 'connection_status',
                              item: user,
                              value: connection,
                            });
                          }
                        }
                      }}
                    />
                  ))}
                </Layout.FlexCol>
                <div ref={targetRef} />
                {isLoadingMoreAllFriends && <AllFriendItemLoader />}
              </EmptyStateContainer>
            ) : selectedType === 'close_friends' ? (
              <NoCloseFriends />
            ) : null}
          </Layout.FlexCol>
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

const EmptyStateContainer = styled(Layout.FlexCol)<{ isEmpty: boolean }>`
  width: 100%;
  padding: 8px 0;
`;

export default FriendsList;
