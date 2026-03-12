import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Divider from '@components/_common/divider/Divider';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import MyCheckInCard from '@components/check-in/my-check-in-card/MyCheckInCard';
import FriendItemWithUpdates from '@components/friends/friend-item-with-updates/FriendItemWithUpdates';
import NoCloseFriends from '@components/friends/no-close-friends/NoCloseFriends';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import NoteItem from '@components/note/note-item/NoteItem';
import NoteLoader from '@components/note/note-loader/NoteLoader';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { Colors, Layout, Typo } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { Connection, FriendType } from '@models/api/friends';
import { Note, POST_TYPE, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getMe } from '@utils/apis/my';
import { MainScrollContainer } from 'src/routes/Root';
import useInfiniteFetchFriends from '../../hooks/useInfiniteFetchFriends';
import { AllFriendItemLoader, AllFriendListLoader } from './FriendsLoader';

type TabType = 'friends' | 'posts';

function FriendsList() {
  const [t] = useTranslation('translation');
  const [selectedTab, setSelectedTab] = useState<TabType>('friends');
  const [closeFriendsOnly, setCloseFriendsOnly] = useState(false);

  const friendType: FriendType = closeFriendsOnly ? 'close_friends' : 'all';

  const {
    targetRef,
    allFriends,
    isAllFriendsLoading,
    isLoadingMoreAllFriends,
    refetchAllFriends,
    updateFriendList,
  } = useInfiniteFetchFriends({ type: friendType });

  // Keep hooks for cross-tab updates
  const allFriendsHook = useInfiniteFetchFriends({ type: 'all' });
  const closeFriendsHook = useInfiniteFetchFriends({ type: 'close_friends' });

  // Feed data for Posts tab
  const { fetchCheckIn } = useBoundStore((state) => ({
    fetchCheckIn: state.fetchCheckIn,
  }));

  const {
    targetRef: feedTargetRef,
    data: feedItems,
    isLoading: isFeedLoading,
    isLoadingMore: isFeedLoadingMore,
    mutate: refetchFeed,
  } = useSWRInfiniteScroll<Note | Response>({
    key: `/user/feed/full`,
  });

  const handleRefresh = async () => {
    if (selectedTab === 'friends') {
      await Promise.all([refetchAllFriends(), getMe()]);
    } else {
      await Promise.all([refetchFeed(), fetchCheckIn(), getMe()]);
    }
  };

  const { scrollRef } = useRestoreScrollPosition('friendsPage');

  const { filteredFriends } = useMemo(() => {
    if (!allFriends) {
      return { filteredFriends: [] };
    }

    const allFriendsList = allFriends
      .flatMap(({ results }) => results || [])
      .filter((user) => !user.is_hidden);

    return {
      filteredFriends: allFriendsList,
    };
  }, [allFriends]);

  const isEmpty = filteredFriends.length === 0 && !isAllFriendsLoading;

  const renderFeedItem = useCallback(
    (item: Note | Response) => {
      if (item.type === POST_TYPE.NOTE) {
        return <NoteItem key={item.id} note={item} isMyPage={false} refresh={refetchFeed} />;
      }
      return (
        <ResponseItem
          key={item.id}
          response={item}
          displayType="FEED"
          isMyPage={false}
          refresh={refetchFeed}
        />
      );
    },
    [refetchFeed],
  );

  return (
    <MainScrollContainer scrollRef={scrollRef} showNotificationPermission>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol
          w="100%"
          pb={FLOATING_BUTTON_SIZE + 20}
          h={isEmpty && selectedTab === 'friends' ? '100%' : undefined}
        >
          {/* My Check-in Card */}
          <Layout.FlexCol w="100%" ph={16} pt={12} pb={8}>
            <MyCheckInCard />
          </Layout.FlexCol>

          {/* Divider */}
          <Divider width={2} bgColor="LIGHT" />

          {/* Tab bar */}
          <Layout.FlexRow w="100%" alignItems="center" ph={16} pt={4}>
            <Layout.FlexRow gap={16} flex={1}>
              <TabButton
                $active={selectedTab === 'friends'}
                onClick={() => setSelectedTab('friends')}
              >
                Friends
              </TabButton>
              <TabButton $active={selectedTab === 'posts'} onClick={() => setSelectedTab('posts')}>
                Posts
              </TabButton>
            </Layout.FlexRow>

            {/* Close friends filter */}
            {selectedTab === 'friends' && (
              <Layout.FlexRow
                gap={6}
                alignItems="center"
                style={{ cursor: 'pointer' }}
                onClick={() => setCloseFriendsOnly((prev) => !prev)}
              >
                <CheckboxIcon checked={closeFriendsOnly} />
                <Typo type="label-medium" color={closeFriendsOnly ? 'BLACK' : 'MEDIUM_GRAY'}>
                  Close friends
                </Typo>
              </Layout.FlexRow>
            )}
          </Layout.FlexRow>

          {/* Tab content */}
          {selectedTab === 'friends' ? (
            <Layout.FlexCol w="100%" flex={isEmpty ? 1 : undefined}>
              {isAllFriendsLoading ? (
                <Layout.FlexCol w="100%" pv={8}>
                  <AllFriendListLoader />
                </Layout.FlexCol>
              ) : filteredFriends.length > 0 ? (
                <Layout.FlexCol w="100%" pv={8}>
                  <Layout.FlexCol w="100%" gap={12}>
                    {filteredFriends.map((user) => (
                      <FriendItemWithUpdates
                        user={user}
                        key={user.id}
                        recentPost={user.recent_post}
                        onConnectionChanged={(userId, connection) => {
                          if (closeFriendsOnly && connection === Connection.FRIEND) {
                            updateFriendList({
                              type: 'break_friends',
                              item: user,
                            });
                            allFriendsHook.updateFriendList({
                              type: 'connection_status',
                              item: user,
                              value: connection,
                            });
                          } else {
                            updateFriendList({
                              type: 'connection_status',
                              item: user,
                              value: connection,
                            });

                            if (!closeFriendsOnly) {
                              if (connection === Connection.CLOSE_FRIEND) {
                                const closeFriendsData = closeFriendsHook.allFriends;
                                if (closeFriendsData) {
                                  const exists = closeFriendsData.some((page) =>
                                    page.results?.some((u) => u.id === userId),
                                  );
                                  if (!exists) {
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
                                    closeFriendsHook.updateFriendList({
                                      type: 'connection_status',
                                      item: user,
                                      value: connection,
                                    });
                                  }
                                }
                              } else {
                                closeFriendsHook.updateFriendList({
                                  type: 'break_friends',
                                  item: user,
                                });
                              }
                            } else {
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
                </Layout.FlexCol>
              ) : closeFriendsOnly ? (
                <NoCloseFriends onFriendAdded={() => refetchAllFriends()} />
              ) : null}
            </Layout.FlexCol>
          ) : (
            /* Posts tab */
            <Layout.FlexCol w="100%">
              {isFeedLoading ? (
                <NoteLoader />
              ) : feedItems?.[0] && feedItems[0].count > 0 ? (
                <>
                  {feedItems.map(({ results }) => results?.map((item) => renderFeedItem(item)))}
                  <div ref={feedTargetRef} />
                  {isFeedLoadingMore && (
                    <Layout.FlexRow w="100%" h={40}>
                      <Loader />
                    </Layout.FlexRow>
                  )}
                </>
              ) : (
                <Layout.FlexRow alignItems="center" w="100%" h="100%">
                  <NoContents title={t('no_contents.notes')} />
                </Layout.FlexRow>
              )}
            </Layout.FlexCol>
          )}
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

const TabButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 12px 0;
  cursor: pointer;
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active }) => ($active ? Colors.BLACK : Colors.MEDIUM_GRAY)};
  border-bottom: 2px solid ${({ $active }) => ($active ? '#8700FF' : 'transparent')};
`;

function CheckboxIcon({ checked }: { checked: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="1"
        y="1"
        width="16"
        height="16"
        rx="3"
        stroke={checked ? '#8700FF' : '#D9D9D9'}
        strokeWidth="1.5"
        fill={checked ? '#8700FF' : 'none'}
      />
      {checked && (
        <path
          d="M5 9L8 12L13 6"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default FriendsList;
