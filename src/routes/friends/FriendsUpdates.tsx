import { useMemo } from 'react';
import Divider from '@components/_common/divider/Divider';
import NoContents from '@components/_common/no-contents/NoContents';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import MyCheckInCard from '@components/check-in/my-check-in-card/MyCheckInCard';
import FriendItemWithUpdates from '@components/friends/friend-item-with-updates/FriendItemWithUpdates';
import { Layout } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { Connection } from '@models/api/friends';
import { getMe } from '@utils/apis/my';
import { MainScrollContainer } from 'src/routes/Root';
import useInfiniteFetchFriends from '../../hooks/useInfiniteFetchFriends';
import { AllFriendItemLoader, AllFriendListLoader } from './FriendsLoader';

function FriendsUpdates() {
  const {
    targetRef,
    allFriends,
    isAllFriendsLoading,
    isLoadingMoreAllFriends,
    refetchAllFriends,
    updateFriendList,
  } = useInfiniteFetchFriends({ type: 'all' });

  const { scrollRef } = useRestoreScrollPosition('friendsUpdatesPage');

  const friends = useMemo(
    () =>
      (allFriends || []).flatMap(({ results }) => results || []).filter((user) => !user.is_hidden),
    [allFriends],
  );

  const handleRefresh = async () => {
    await Promise.all([refetchAllFriends(), getMe()]);
  };

  const isEmpty = friends.length === 0 && !isAllFriendsLoading;

  return (
    <MainScrollContainer scrollRef={scrollRef} showNotificationPermission>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%" h={isEmpty ? '100%' : undefined}>
          <Layout.FlexCol w="100%" ph={16} pt={12} pb={8}>
            <MyCheckInCard />
          </Layout.FlexCol>

          <Divider width={2} bgColor="LIGHT" />

          {isAllFriendsLoading ? (
            <Layout.FlexCol w="100%" pv={8}>
              <AllFriendListLoader />
            </Layout.FlexCol>
          ) : friends.length > 0 ? (
            <Layout.FlexCol w="100%" pv={8}>
              <Layout.FlexCol w="100%" gap={20}>
                {friends.map((user) => (
                  <FriendItemWithUpdates
                    key={user.id}
                    user={user}
                    tabMode="unified"
                    onConnectionChanged={(_userId, connection) => {
                      updateFriendList({
                        type: 'connection_status',
                        item: user,
                        value: connection as Connection,
                      });
                    }}
                    onSubscriptionChanged={(_userId, hasSubscription) => {
                      updateFriendList({
                        type: 'is_subscribed',
                        item: user,
                        value: hasSubscription,
                      });
                    }}
                  />
                ))}
              </Layout.FlexCol>
              <div ref={targetRef} />
              {isLoadingMoreAllFriends && <AllFriendItemLoader />}
            </Layout.FlexCol>
          ) : (
            <Layout.FlexRow alignItems="center" w="100%" h="100%">
              <NoContents title="No friends yet" />
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default FriendsUpdates;
