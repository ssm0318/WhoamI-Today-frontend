import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import CheckInUpdateCard from '@components/friends/check-in-update-card/CheckInUpdateCard';
import MissionGroupItem from '@components/note/mission-group-item/MissionGroupItem';
import NoteItem from '@components/note/note-item/NoteItem';
import NoteLoader from '@components/note/note-loader/NoteLoader';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { Layout } from '@design-system';
import useInfiniteFetchFriends from '@hooks/useInfiniteFetchFriends';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { Connection, FriendType } from '@models/api/friends';
import { SocialBattery } from '@models/checkIn';
import { AllPostFeedItem, POST_TYPE } from '@models/post';

interface Props {
  closeFriendsOnly: boolean;
}

interface CheckInUpdateItem {
  key: string;
  username: string;
  profileImage: string | null;
  component: 'battery' | 'mood' | 'thought' | 'song';
  content: string;
  socialBattery?: SocialBattery | null;
  trackId?: string;
  timestamp: string;
}

function FriendsTimelineFeed({ closeFriendsOnly }: Props) {
  const [t] = useTranslation('translation');

  const friendType: FriendType = closeFriendsOnly ? 'close_friends' : 'all';
  const { allFriends } = useInfiniteFetchFriends({ type: friendType });

  const {
    targetRef,
    data: feedItems,
    isLoading,
    isLoadingMore,
    mutate: refetchFeed,
  } = useSWRInfiniteScroll<AllPostFeedItem>({
    key: '/user/feed/full',
  });

  // Build check-in update cards only for recently updated components
  const checkInUpdates = useMemo(() => {
    const friends = (allFriends ?? [])
      .flatMap(({ results }) => results ?? [])
      .filter((u) => !u.is_hidden && !u.current_user_read_check_in);

    const updates: CheckInUpdateItem[] = [];
    const now = new Date().toISOString();

    friends.forEach((friend) => {
      const updated = new Set(friend.recently_updated_check_in ?? []);
      if (updated.size === 0) return;

      const thought = (friend as any).thought ?? '';

      if (updated.has('battery') && friend.social_battery) {
        updates.push({
          key: `ci-battery-${friend.id}`,
          username: friend.username,
          profileImage: friend.profile_image,
          component: 'battery',
          content: friend.social_battery,
          socialBattery: friend.social_battery,
          timestamp: friend.battery_updated_at || now,
        });
      }
      if (updated.has('mood') && friend.mood) {
        const moodStr = Array.isArray(friend.mood) ? friend.mood.join(',') : friend.mood;
        updates.push({
          key: `ci-mood-${friend.id}`,
          username: friend.username,
          profileImage: friend.profile_image,
          component: 'mood',
          content: moodStr,
          timestamp: friend.mood_updated_at || now,
        });
      }
      if (updated.has('thought') && thought) {
        updates.push({
          key: `ci-thought-${friend.id}`,
          username: friend.username,
          profileImage: friend.profile_image,
          component: 'thought',
          content: thought,
          timestamp: friend.thought_updated_at || now,
        });
      }
      if (updated.has('song') && friend.track_id) {
        updates.push({
          key: `ci-song-${friend.id}`,
          username: friend.username,
          profileImage: friend.profile_image,
          component: 'song',
          content: '',
          trackId: friend.track_id,
          timestamp: friend.song_updated_at || now,
        });
      }
    });

    return updates;
  }, [allFriends]);

  // Filter feed items to close friends when checkbox is on
  const filteredFeedItems = useMemo(() => {
    if (!feedItems) return [];
    const items = feedItems.flatMap(({ results }) => results ?? []);
    if (!closeFriendsOnly) return items;
    return items.filter((item) => {
      const authorDetail = (item as any).author_detail;
      return authorDetail?.connection_status === Connection.CLOSE_FRIEND;
    });
  }, [feedItems, closeFriendsOnly]);

  const combinedItems = useMemo(() => {
    const posts = filteredFeedItems.map((item) => ({
      type: 'post' as const,
      id:
        item.type === POST_TYPE.MISSION_GROUP
          ? `mission-group-${item.mission_id ?? item.mission_prompt}`
          : item.id,
      timestamp: item.created_at,
      data: item,
    }));
    const updates = checkInUpdates.map((update) => ({
      type: 'checkin_update' as const,
      id: update.key,
      timestamp: update.timestamp,
      data: update,
    }));

    return [...posts, ...updates].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [filteredFeedItems, checkInUpdates]);

  const renderFeedItem = useCallback(
    (item: AllPostFeedItem) => {
      if (item.type === POST_TYPE.NOTE) {
        return <NoteItem key={item.id} note={item} isMyPage={false} refresh={refetchFeed} />;
      }
      if (item.type === POST_TYPE.MISSION_GROUP) {
        return (
          <MissionGroupItem
            key={`mission-group-${item.mission_id ?? item.mission_prompt}`}
            group={item}
            refresh={refetchFeed}
          />
        );
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
    <Layout.FlexCol w="100%">
      {isLoading ? (
        <NoteLoader />
      ) : combinedItems.length > 0 ? (
        <Layout.FlexCol gap={16} ph={16} pt={16} w="100%" style={{ boxSizing: 'border-box' }}>
          {combinedItems.map((item) => {
            if (item.type === 'checkin_update') {
              const update = item.data;
              return (
                <CheckInUpdateCard
                  key={update.key}
                  username={update.username}
                  profileImage={update.profileImage}
                  component={update.component}
                  content={update.content}
                  socialBattery={update.socialBattery}
                  trackId={update.trackId}
                  timestamp={update.timestamp}
                />
              );
            }
            return renderFeedItem(item.data);
          })}
          <div ref={targetRef} />
          {isLoadingMore && (
            <Layout.FlexRow w="100%" h={40}>
              <Loader />
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
      ) : (
        <Layout.FlexRow alignItems="center" w="100%" h="100%" justifyContent="center" pv={40}>
          <NoContents title={t('no_contents.notes')} />
        </Layout.FlexRow>
      )}
    </Layout.FlexCol>
  );
}

export default FriendsTimelineFeed;
