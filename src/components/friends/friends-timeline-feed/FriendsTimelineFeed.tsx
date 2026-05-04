import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import CheckInDetailBottomSheet from '@components/check-in/check-in-detail-bottom-sheet/CheckInDetailBottomSheet';
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
  checkInId: number;
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
  const navigate = useNavigate();
  const [selectedCheckInUpdate, setSelectedCheckInUpdate] = useState<CheckInUpdateItem | null>(
    null,
  );

  const friendType: FriendType = closeFriendsOnly ? 'close_friends' : 'check_in_updates';
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
      .filter((u) => {
        if (u.is_hidden) return false;
        if (!closeFriendsOnly) return true;
        return u.connection_status === Connection.CLOSE_FRIEND;
      });

    const updates: CheckInUpdateItem[] = [];
    friends.forEach((friend) => {
      const updated = new Set(friend.recently_updated_check_in ?? []);
      if (updated.size === 0) return;

      const thought = (friend as any).thought ?? '';

      if (updated.has('battery') && friend.social_battery && friend.battery_updated_at) {
        updates.push({
          key: `ci-battery-${friend.id}`,
          checkInId: friend.check_in_id!,
          username: friend.username,
          profileImage: friend.profile_image,
          component: 'battery',
          content: friend.social_battery,
          socialBattery: friend.social_battery,
          timestamp: friend.battery_updated_at,
        });
      }
      if (updated.has('mood') && friend.mood && friend.mood_updated_at) {
        const moodStr = Array.isArray(friend.mood) ? friend.mood.join(',') : friend.mood;
        updates.push({
          key: `ci-mood-${friend.id}`,
          checkInId: friend.check_in_id!,
          username: friend.username,
          profileImage: friend.profile_image,
          component: 'mood',
          content: moodStr,
          timestamp: friend.mood_updated_at,
        });
      }
      if (updated.has('thought') && thought && friend.thought_updated_at) {
        updates.push({
          key: `ci-thought-${friend.id}`,
          checkInId: friend.check_in_id!,
          username: friend.username,
          profileImage: friend.profile_image,
          component: 'thought',
          content: thought,
          timestamp: friend.thought_updated_at,
        });
      }
      if (updated.has('song') && friend.track_id && friend.song_updated_at) {
        updates.push({
          key: `ci-song-${friend.id}`,
          checkInId: friend.check_in_id!,
          username: friend.username,
          profileImage: friend.profile_image,
          component: 'song',
          content: '',
          trackId: friend.track_id,
          timestamp: friend.song_updated_at,
        });
      }
    });

    return updates;
  }, [allFriends, closeFriendsOnly]);

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
                  onProfileClick={() =>
                    navigate(`/users/${update.username}`, { state: { source: 'friends_feed' } })
                  }
                  onComponentClick={() => setSelectedCheckInUpdate(update)}
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
          {selectedCheckInUpdate && (
            <CheckInDetailBottomSheet
              visible={!!selectedCheckInUpdate}
              closeBottomSheet={() => setSelectedCheckInUpdate(null)}
              focusComponent={selectedCheckInUpdate.component}
              checkInId={selectedCheckInUpdate.checkInId}
              username={selectedCheckInUpdate.username}
              profileImage={selectedCheckInUpdate.profileImage}
              socialBattery={selectedCheckInUpdate.socialBattery}
              trackId={selectedCheckInUpdate.trackId}
              mood={
                selectedCheckInUpdate.component === 'mood'
                  ? selectedCheckInUpdate.content.split(',').filter(Boolean)
                  : undefined
              }
              description={
                selectedCheckInUpdate.component === 'thought'
                  ? selectedCheckInUpdate.content
                  : undefined
              }
            />
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
