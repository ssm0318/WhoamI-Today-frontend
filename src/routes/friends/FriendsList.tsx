import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Divider from '@components/_common/divider/Divider';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import FriendProfileAccordionItem from '@components/friends/friend-profile-accordion-item/FriendProfileAccordionItem';
import FriendsTimelineFeed from '@components/friends/friends-timeline-feed/FriendsTimelineFeed';
import NoCloseFriends from '@components/friends/no-close-friends/NoCloseFriends';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import { Colors, Layout, SvgIcon, Typo } from '@design-system';
import { usePersistedExpandedFriendId } from '@hooks/usePersistedExpandedFriendId';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { Connection, FriendType, UpdatedProfile } from '@models/api/friends';
import { POST_TYPE } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { readFriendCheckIn } from '@utils/apis/checkIn';
import { getMe } from '@utils/apis/my';
import { readNote } from '@utils/apis/note';
import { readResponse } from '@utils/apis/responses';
import { MainScrollContainer } from 'src/routes/Root';
import useInfiniteFetchFriends from '../../hooks/useInfiniteFetchFriends';
import { AllFriendItemLoader, AllFriendListLoader } from './FriendsLoader';

type TabType = 'people' | 'feed';

function FriendsList() {
  const [t] = useTranslation('translation');
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab: TabType = searchParams.get('tab') === 'feed' ? 'feed' : 'people';
  const [selectedTab, setSelectedTab] = useState<TabType>(initialTab);
  const [expandedFriendId, setExpandedFriendId] = usePersistedExpandedFriendId();

  // Browse mode can prefill the close-friends-only filter when "Just my people" is active.
  const browseModeForcesCloseFriends = useBoundStore(
    (state) => !!state.activeBrowseMode?.config.filters.friends_close_only,
  );
  const [closeFriendsOnly, setCloseFriendsOnly] = useState(browseModeForcesCloseFriends);
  // Reflect mode flips after the screen mounts (e.g., user opens picker from header).
  useEffect(() => {
    if (browseModeForcesCloseFriends) setCloseFriendsOnly(true);
  }, [browseModeForcesCloseFriends]);
  const trackEvent = useTrackEvent();

  useEffect(() => {
    const nextTab: TabType = searchParams.get('tab') === 'feed' ? 'feed' : 'people';
    setSelectedTab(nextTab);
  }, [searchParams]);

  const handleSelectTab = useCallback(
    (tab: TabType) => {
      setSelectedTab(tab);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('tab', tab);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleToggleCloseFriends = () => {
    setCloseFriendsOnly((prev) => {
      const next = !prev;
      trackEvent('friends_filter_close_only_toggled', { value: next ? 'on' : 'off' });
      return next;
    });
  };

  // Sub-tab dwell tracking
  const tabStartedAtRef = useRef<number>(Date.now());
  const previousTabRef = useRef<TabType>(selectedTab);
  useEffect(() => {
    if (previousTabRef.current === selectedTab) return;
    const duration_ms = Date.now() - tabStartedAtRef.current;
    if (duration_ms >= 500) {
      trackEvent('friends_subtab_dwell', {
        tab: previousTabRef.current,
        duration_ms,
      });
    }
    previousTabRef.current = selectedTab;
    tabStartedAtRef.current = Date.now();
  }, [selectedTab, trackEvent]);
  useEffect(() => {
    return () => {
      const duration_ms = Date.now() - tabStartedAtRef.current;
      if (duration_ms < 500) return;
      trackEvent('friends_subtab_dwell', {
        tab: previousTabRef.current,
        duration_ms,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const closeFriendsHook = useInfiniteFetchFriends({ type: 'close_friends' });

  const { fetchCheckIn, myProfile, checkIn } = useBoundStore((state) => ({
    fetchCheckIn: state.fetchCheckIn,
    myProfile: state.myProfile,
    checkIn: state.checkIn,
  }));

  // Fetch my check-in on mount (MyCheckInCard used to do this internally)
  useEffect(() => {
    fetchCheckIn();
  }, [fetchCheckIn]);

  const handleRefresh = async () => {
    await Promise.all([refetchAllFriends(), fetchCheckIn(), getMe()]);
  };

  const { scrollRef } = useRestoreScrollPosition('friendsPage');

  const filteredFriends = useMemo(() => {
    return (allFriends || [])
      .flatMap(({ results }) => results || [])
      .filter((user) => !user.is_hidden);
  }, [allFriends]);

  // Collapse a persisted expansion if the friend is no longer in the list
  // (e.g., filter toggled, friend hidden) — avoids a phantom expansion when they reappear.
  useEffect(() => {
    if (expandedFriendId === null || expandedFriendId === -1) return;
    const stillVisible = filteredFriends.some((f) => f.id === expandedFriendId);
    if (!stillVisible) setExpandedFriendId(null);
  }, [filteredFriends, expandedFriendId, setExpandedFriendId]);

  const isEmpty = filteredFriends.length === 0 && !isAllFriendsLoading;

  // Build "my" data as an UpdatedProfile-like object for the accordion item
  const myAccordionUser = useMemo((): UpdatedProfile | null => {
    if (!myProfile) return null;
    return {
      ...myProfile,
      is_favorite: false,
      is_hidden: false,
      current_user_read: true,
      current_user_read_check_in: true,
      unread_cnt: 0,
      unread_chat_count: 0,
      check_in_id: checkIn?.id ?? null,
      track_id: checkIn?.track_id,
      mood: checkIn?.mood,
      social_battery: checkIn?.social_battery,
      description: checkIn?.thought ?? '',
      thought: checkIn?.thought ?? '',
      recent_posts: myProfile.recent_posts ?? [],
      sent_pokes: {},
    } as UpdatedProfile;
  }, [myProfile, checkIn]);

  // Per-friend read marking when expanding
  const markFriendAsRead = useCallback(
    async (friend: UpdatedProfile) => {
      const promises: Promise<unknown>[] = [];

      if (friend.check_in_id && !friend.current_user_read_check_in) {
        promises.push(readFriendCheckIn(friend.check_in_id));
      }

      const unreadNoteIds = (friend.recent_posts ?? [])
        .filter((p) => p.type === POST_TYPE.NOTE && !p.current_user_read)
        .map((p) => p.id);
      const unreadResponseIds = (friend.recent_posts ?? [])
        .filter((p) => p.type === POST_TYPE.RESPONSE && !p.current_user_read)
        .map((p) => p.id);

      if (unreadNoteIds.length) promises.push(readNote(unreadNoteIds));
      if (unreadResponseIds.length) promises.push(readResponse(unreadResponseIds));

      if (promises.length > 0) {
        await Promise.allSettled(promises);
      }

      // Optimistic update
      updateFriendList({ type: 'mark_read', item: friend });
      closeFriendsHook.updateFriendList({ type: 'mark_read', item: friend });
    },
    [updateFriendList, closeFriendsHook],
  );

  const handleToggleExpand = useCallback(
    (friendId: number) => {
      setExpandedFriendId((prev) => {
        if (prev === friendId) return null;

        // Mark as read when expanding
        const friend = filteredFriends.find((f) => f.id === friendId);
        if (friend) {
          markFriendAsRead(friend);
        }

        trackEvent('friends_profile_expanded', { friend_id: friendId });
        return friendId;
      });
    },
    [filteredFriends, markFriendAsRead, trackEvent, setExpandedFriendId],
  );

  const handleToggleMyExpand = useCallback(() => {
    setExpandedFriendId((prev) => (prev === -1 ? null : -1));
  }, [setExpandedFriendId]);

  const handleConnectionChanged = useCallback(
    (userId: number, connection: Connection) => {
      const user = filteredFriends.find((f) => f.id === userId);
      if (!user) return;

      if (closeFriendsOnly && connection === Connection.FRIEND) {
        updateFriendList({ type: 'break_friends', item: user });
      } else {
        updateFriendList({ type: 'connection_status', item: user, value: connection });

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
            closeFriendsHook.updateFriendList({ type: 'break_friends', item: user });
          }
        }
      }
    },
    [closeFriendsOnly, filteredFriends, updateFriendList, closeFriendsHook],
  );

  const handleSubscriptionChanged = useCallback(
    (userId: number, hasSubscription: boolean) => {
      const user = filteredFriends.find((f) => f.id === userId);
      if (!user) return;
      updateFriendList({ type: 'is_subscribed', item: user, value: hasSubscription });
      closeFriendsHook.updateFriendList({
        type: 'is_subscribed',
        item: user,
        value: hasSubscription,
      });
    },
    [filteredFriends, updateFriendList, closeFriendsHook],
  );

  return (
    <MainScrollContainer scrollRef={scrollRef} showNotificationPermission>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol
          w="100%"
          pb={FLOATING_BUTTON_SIZE + 20}
          h={isEmpty && selectedTab === 'people' ? '100%' : undefined}
        >
          {/* Tab bar */}
          <Layout.FlexRow w="100%" alignItems="center" ph={16} pt={4}>
            <Layout.FlexRow gap={16} flex={1}>
              <TabButton
                $active={selectedTab === 'people'}
                onClick={() => handleSelectTab('people')}
              >
                <SvgIcon
                  name={selectedTab === 'people' ? 'friends_active' : 'friends_inactive'}
                  size={18}
                />
                People
              </TabButton>
              <TabButton $active={selectedTab === 'feed'} onClick={() => handleSelectTab('feed')}>
                <SvgIcon
                  name={selectedTab === 'feed' ? 'feed_active' : 'feed_inactive'}
                  size={18}
                />
                Feed
              </TabButton>
            </Layout.FlexRow>

            {/* Close friends filter */}
            <Layout.FlexRow
              gap={6}
              alignItems="center"
              style={{ cursor: 'pointer' }}
              data-preview-exempt
              onClick={handleToggleCloseFriends}
            >
              <CheckboxIcon checked={closeFriendsOnly} />
              <Typo type="label-medium" color={closeFriendsOnly ? 'BLACK' : 'MEDIUM_GRAY'}>
                Close friends
              </Typo>
            </Layout.FlexRow>
          </Layout.FlexRow>

          {/* Tab content */}
          {selectedTab === 'people' ? (
            <Layout.FlexCol w="100%" flex={isEmpty ? 1 : undefined}>
              {/* My card */}
              {myAccordionUser && (
                <Layout.FlexCol w="100%" pv={8}>
                  <FriendProfileAccordionItem
                    user={myAccordionUser}
                    isExpanded={expandedFriendId === -1}
                    onToggleExpand={handleToggleMyExpand}
                    isMyCard
                  />
                </Layout.FlexCol>
              )}

              <Divider width={2} bgColor="LIGHT" />

              {isAllFriendsLoading ? (
                <Layout.FlexCol w="100%" pv={8}>
                  <AllFriendListLoader />
                </Layout.FlexCol>
              ) : filteredFriends.length > 0 ? (
                <Layout.FlexCol w="100%" pv={8}>
                  <Layout.FlexCol w="100%" gap={8}>
                    {filteredFriends.map((user) => (
                      <FriendProfileAccordionItem
                        user={user}
                        key={user.id}
                        isExpanded={expandedFriendId === user.id}
                        onToggleExpand={() => handleToggleExpand(user.id)}
                        onSubscriptionChanged={handleSubscriptionChanged}
                        onConnectionChanged={handleConnectionChanged}
                      />
                    ))}
                  </Layout.FlexCol>
                  <div ref={targetRef} />
                  {isLoadingMoreAllFriends && <AllFriendItemLoader />}
                </Layout.FlexCol>
              ) : closeFriendsOnly ? (
                <NoCloseFriends onFriendAdded={() => refetchAllFriends()} />
              ) : (
                <Layout.FlexRow w="100%" justifyContent="center" pv={20}>
                  <Typo type="title-small" color="MEDIUM_GRAY">
                    {t('no_contents.friends')}
                  </Typo>
                </Layout.FlexRow>
              )}
            </Layout.FlexCol>
          ) : (
            /* Feed tab */
            <FriendsTimelineFeed closeFriendsOnly={closeFriendsOnly} />
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
