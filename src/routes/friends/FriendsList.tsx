import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Divider from '@components/_common/divider/Divider';
import NoContents from '@components/_common/no-contents/NoContents';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import MyCheckInCard from '@components/check-in/my-check-in-card/MyCheckInCard';
import FriendItemWithUpdates from '@components/friends/friend-item-with-updates/FriendItemWithUpdates';
import NoCloseFriends from '@components/friends/no-close-friends/NoCloseFriends';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import { Colors, Layout, Typo } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { Connection, FriendType, UpdatedProfile } from '@models/api/friends';
import { useBoundStore } from '@stores/useBoundStore';
import { getMe } from '@utils/apis/my';
import { MainScrollContainer } from 'src/routes/Root';
import useInfiniteFetchFriends from '../../hooks/useInfiniteFetchFriends';
import { AllFriendItemLoader, AllFriendListLoader } from './FriendsLoader';

type TabType = 'check-in' | 'posts';

function FriendsList() {
  const [t] = useTranslation('translation');
  const [selectedTab, setSelectedTab] = useState<TabType>('check-in');
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
  const postsFriendsHook = useInfiniteFetchFriends({ type: friendType });
  const closeFriendsHook = useInfiniteFetchFriends({ type: 'close_friends' });

  const { fetchCheckIn } = useBoundStore((state) => ({
    fetchCheckIn: state.fetchCheckIn,
  }));

  const handleRefresh = async () => {
    if (selectedTab === 'check-in') {
      await Promise.all([refetchAllFriends(), getMe()]);
    } else {
      await Promise.all([postsFriendsHook.refetchAllFriends(), fetchCheckIn(), getMe()]);
    }
  };

  const { scrollRef } = useRestoreScrollPosition('friendsPage');

  const { filteredFriends, filteredPostsFriends } = useMemo(() => {
    const allFriendsList = (allFriends || [])
      .flatMap(({ results }) => results || [])
      .filter((user) => !user.is_hidden);
    const postsFriendsList = (postsFriendsHook.allFriends || [])
      .flatMap(({ results }) => results || [])
      .filter((user) => !user.is_hidden);

    return {
      filteredFriends: allFriendsList,
      filteredPostsFriends: postsFriendsList,
    };
  }, [allFriends, postsFriendsHook.allFriends]);

  const isEmpty = filteredFriends.length === 0 && !isAllFriendsLoading;
  const isPostsEmpty = filteredPostsFriends.length === 0 && !postsFriendsHook.isAllFriendsLoading;

  const hasCheckInUpdates = filteredFriends.some(
    (user) =>
      !user.current_user_read &&
      !!(user.track_id || user.mood || user.social_battery || user.description),
  );
  const isWithin24Hours = (dateString?: string) => {
    if (!dateString) return false;
    const postDate = new Date(dateString);
    if (Number.isNaN(postDate.getTime())) return false;
    return Date.now() - postDate.getTime() <= 24 * 60 * 60 * 1000;
  };
  const hasUnreadPosts = (user: UpdatedProfile) => {
    if ((user.unread_post_cnt || 0) > 0) return true;
    if (user.latest_unread_post) return true;
    if (!user.recent_post || user.recent_post.is_read) return false;
    if (!user.recent_post.created_at) return true;
    return isWithin24Hours(user.recent_post.created_at);
  };
  const hasNewPosts = filteredPostsFriends.some((user) => hasUnreadPosts(user));

  return (
    <MainScrollContainer scrollRef={scrollRef} showNotificationPermission>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol
          w="100%"
          pb={FLOATING_BUTTON_SIZE + 20}
          h={isEmpty && selectedTab === 'check-in' ? '100%' : undefined}
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
                $active={selectedTab === 'check-in'}
                onClick={() => setSelectedTab('check-in')}
              >
                Check In
                {hasCheckInUpdates && <TabBadge>Update</TabBadge>}
              </TabButton>
              <TabButton $active={selectedTab === 'posts'} onClick={() => setSelectedTab('posts')}>
                Posts
                {hasNewPosts && <TabBadge>New</TabBadge>}
              </TabButton>
            </Layout.FlexRow>

            {/* Close friends filter */}
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
          </Layout.FlexRow>

          {/* Tab content */}
          {selectedTab === 'check-in' ? (
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
                        onConnectionChanged={(userId, connection) => {
                          if (closeFriendsOnly && connection === Connection.FRIEND) {
                            updateFriendList({
                              type: 'break_friends',
                              item: user,
                            });
                            postsFriendsHook.updateFriendList({
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
                              postsFriendsHook.updateFriendList({
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
              {postsFriendsHook.isAllFriendsLoading ? (
                <Layout.FlexCol w="100%" pv={8}>
                  <AllFriendListLoader />
                </Layout.FlexCol>
              ) : filteredPostsFriends.length > 0 ? (
                <Layout.FlexCol w="100%" pv={8}>
                  <Layout.FlexCol w="100%" gap={12}>
                    {filteredPostsFriends.map((user) => (
                      <FriendItemWithUpdates
                        key={user.id}
                        user={user}
                        tabMode="posts"
                        hasNewPost={hasUnreadPosts(user)}
                      />
                    ))}
                  </Layout.FlexCol>
                  <div ref={postsFriendsHook.targetRef} />
                  {postsFriendsHook.isLoadingMoreAllFriends && <AllFriendItemLoader />}
                </Layout.FlexCol>
              ) : (
                <Layout.FlexRow alignItems="center" w="100%" h="100%">
                  <NoContents title={isPostsEmpty ? 'No friends yet' : t('no_contents.notes')} />
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
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active }) => ($active ? Colors.BLACK : Colors.MEDIUM_GRAY)};
  border-bottom: 2px solid ${({ $active }) => ($active ? '#8700FF' : 'transparent')};
`;

const TabBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 999px;
  background: #eee6f4;
  color: #8700ff;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.1;
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
