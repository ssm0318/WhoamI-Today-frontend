import { useMemo, useState } from 'react';
import styled from 'styled-components';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import FriendItemWithUpdates from '@components/friends/friend-item-with-updates/FriendItemWithUpdates';
import FriendTypeChip, { FriendType } from '@components/friends/friend-type-chip/FriendTypeChip';
import NoCloseFriends from '@components/friends/no-close-friends/NoCloseFriends';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import { BOTTOM_TABBAR_HEIGHT, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
// 테스트용으로 주석 처리: 나중에 실제 필터링 로직으로 복원 시 필요
// import { Connection } from '@models/api/friends';
import { SocialBattery } from '@models/checkIn';
import { POST_TYPE, PostVisibility } from '@models/post';
import { getMe } from '@utils/apis/my';
import { MainScrollContainer } from 'src/routes/Root';
import useInfiniteFetchFriends from '../../hooks/useInfiniteFetchFriends';
import { AllFriendItemLoader, AllFriendListLoader } from './FriendsLoader';

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

function FriendsList() {
  const [selectedType, setSelectedType] = useState<FriendType>('all');

  const { targetRef, allFriends, isAllFriendsLoading, isLoadingMoreAllFriends, refetchAllFriends } =
    useInfiniteFetchFriends();

  const handleRefresh = async () => {
    await Promise.all([refetchAllFriends(), getMe()]);
  };

  const { scrollRef } = useRestoreScrollPosition('friendsPage');

  const { allFriendsCount, filteredFriends } = useMemo(() => {
    if (!allFriends) {
      return { allFriendsCount: 0, filteredFriends: [] };
    }

    const allFriendsList = allFriends
      .flatMap(({ results }) => results || [])
      .filter((user) => !user.is_hidden);

    // eslint-disable-next-line no-console
    console.log('FriendsList - allFriends:', allFriends);
    // eslint-disable-next-line no-console
    console.log('FriendsList - allFriendsList:', allFriendsList);
    // eslint-disable-next-line no-console
    console.log('FriendsList - allFriendsList length:', allFriendsList.length);
    allFriendsList.forEach((friend) => {
      // eslint-disable-next-line no-console
      console.log(
        `Friend: ${friend.username}, connection_status: ${friend.connection_status}, is_hidden: ${friend.is_hidden}`,
      );
    });

    // 테스트용으로 주석 처리: 나중에 실제 필터링 로직으로 복원
    // const closeFriendsList = allFriendsList.filter(
    //   (user) => user.connection_status === Connection.CLOSE_FRIEND,
    // );

    // 테스트용: CloseFriends 선택 시 빈 배열 반환
    const filtered = selectedType === 'close' ? [] : allFriendsList;

    // eslint-disable-next-line no-console
    console.log('FriendsList - filtered:', filtered);
    // eslint-disable-next-line no-console
    console.log('FriendsList - filtered length:', filtered.length);

    return {
      allFriendsCount: allFriendsList.length,
      filteredFriends: filtered,
    };
  }, [allFriends, selectedType]);

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
                count={allFriendsCount}
                onClick={() => setSelectedType('all')}
              />
              <FriendTypeChip
                type="close"
                isSelected={selectedType === 'close'}
                onClick={() => setSelectedType('close')}
              />
            </Layout.FlexRow>

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
                        // TODO: 더미 데이터 교체
                        recentPost={{
                          content: 'test',
                          id: 1,
                          created_at: '2021-01-01',
                          updated_at: '2021-01-01',
                          author: 'test',
                          author_detail: user,
                          like_count: 0,
                          current_user_like_id: null,
                          current_user_reaction_id_list: [],
                          type: POST_TYPE.NOTE,
                          images: [],
                          comment_count: 0,
                          like_user_sample: [],
                          like_reaction_user_sample: [],
                          comments: [],
                          current_user_read: false,
                          is_edited: false,
                          visibility: PostVisibility.FRIENDS,
                        }}
                      />
                    ))}
                  </Layout.FlexCol>
                  {selectedType === 'all' && (
                    <>
                      <div ref={targetRef} />
                      {isLoadingMoreAllFriends && <AllFriendItemLoader />}
                    </>
                  )}
                </>
              ) : selectedType === 'close' ? (
                <NoCloseFriends />
              ) : null}
            </EmptyStateContainer>
          </Layout.FlexCol>
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default FriendsList;
