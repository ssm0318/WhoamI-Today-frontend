import { Track } from '@spotify/web-api-ts-sdk';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import EmojiItem from '@components/reaction/emoji-item/EmojiItem';
import { Font, Layout } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
import { friendList as mockFriendList } from '@mock/friends';
import { User } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { getFriendList } from '@utils/apis/user';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import FriendsInfo from './friends-info/FriendsInfo';
import StatusChip from './status-chip/StatusChip';
import StatusMusic from './status-music/StatusMusic';

// TODO(Gina): 실제 데이터로 바꾸기
function Status() {
  const spotifyManager = SpotifyManager.getInstance();
  const myProfile = useBoundStore((state) => state.myProfile);
  const [friendList, setFriendList] = useState<User[]>();
  console.log(friendList);

  const { username } = useParams();

  const [currentDate] = useState(() => new Date());
  const trackId = '11dFghVXANMlKmJXsNCbNl';
  const [trackData, setTrackData] = useState<Track | null>(null);

  useEffect(() => {
    spotifyManager.getTrack(trackId).then(setTrackData);
  }, [spotifyManager]);

  const fetchFriends = useCallback(async (_next?: string | null) => {
    const { results = [] } = await getFriendList(_next);
    setFriendList((prev) => (_next ? (prev ? [...prev, ...results] : []) : results));
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return (
    <Layout.FlexCol gap={8}>
      <Layout.FlexRow gap={8}>
        <ProfileImage imageUrl={myProfile?.profile_image} username={username} size={80} />
        <Layout.FlexCol gap={8}>
          <Font.Body type="20_semibold">{username}</Font.Body>
          {/* bio */}
          <Font.Body type="14_regular" numberOfLines={2}>
            I’m a Bio! Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit ame.
          </Font.Body>
        </Layout.FlexCol>
      </Layout.FlexRow>
      {/* 친구 목록 */}
      <FriendsInfo friends={mockFriendList} />
      <Layout.FlexCol gap={8} p={16} bgColor="GRAY_14" rounded={8} justifyContent="center">
        <Layout.FlexRow w="100%" alignItems="center" gap={8} justifyContent="space-between">
          {/* availability */}
          <StatusChip availability="AVAILABLE" />
          {/* spotify */}
          {trackData && <StatusMusic track={trackData} />}
          {/* check in time */}
          <Font.Body type="11_regular" numberOfLines={2}>
            Checked in {convertTimeDiffByString(currentDate, new Date('2023-10-28 12:00:00'))}
          </Font.Body>
        </Layout.FlexRow>
        <Layout.FlexRow w="100%" justifyContent="space-between" gap={8}>
          {/* emoji */}
          <EmojiItem emojiString="😋" size={24} bgColor="TRANSPARENT" outline="TRANSPARENT" />
          {/* description */}
          <Font.Body type="14_semibold" numberOfLines={2}>
            Got free boba tea from the new shop at work today!!
          </Font.Body>
        </Layout.FlexRow>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default Status;
