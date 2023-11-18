import { Track } from '@spotify/web-api-ts-sdk';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import EmojiItem from '@components/reaction/emoji-item/EmojiItem';
import { Font, Layout, SvgIcon } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
import { friendList as mockFriendList } from '@mock/friends';
import { User } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { getFriendList } from '@utils/apis/user';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import AddNewStatus from './add-new-status/AddNewStatus';
import FriendsInfo from './friends-info/FriendsInfo';
import StatusChip from './status-chip/StatusChip';
import StatusMusic from './status-music/StatusMusic';

interface StatusProps {
  isMyProfile: boolean;
}

// TODO(Gina): 실제 데이터로 바꾸기
function Status({ isMyProfile }: StatusProps) {
  const spotifyManager = SpotifyManager.getInstance();
  const myProfile = useBoundStore((state) => state.myProfile);
  const [friendList, setFriendList] = useState<User[]>();
  console.log(friendList);

  const { username } = useParams();
  const navigate = useNavigate();

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

  const handleClickEditProfile = () => {
    return navigate('/settings/edit-profile');
  };

  const handleClickEditCheckIn = () => {
    return navigate('/status/edit');
  };

  const handleClickViewMore = () => {
    // TODO 친구 페이지에서 check-in 더보기
  };

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  // FIXME 실제 데이터로
  const isCheckInExists = true;

  return (
    <Layout.FlexCol gap={8}>
      <Layout.FlexRow gap={8}>
        <ProfileImage imageUrl={myProfile?.profile_image} username={username} size={80} />
        <Layout.FlexCol gap={8}>
          <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
            <Font.Body type="20_semibold">{isMyProfile ? myProfile?.username : username}</Font.Body>
            {/* 더보기 TODO(Gina): IconButton으로 변환 */}
            {isMyProfile && (
              <button type="button" onClick={handleClickEditProfile}>
                <SvgIcon name="edit" size={24} />
              </button>
            )}
          </Layout.FlexRow>
          {/* bio */}
          <Font.Body type="14_regular" numberOfLines={2}>
            I’m a Bio! Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit ame.
          </Font.Body>
        </Layout.FlexCol>
      </Layout.FlexRow>
      {/* 친구 목록 */}
      <FriendsInfo friends={mockFriendList} />
      <Layout.FlexCol w="100%" gap={8} p={16} bgColor="GRAY_14" rounded={8} justifyContent="center">
        {isCheckInExists ? (
          <>
            <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between">
              <Layout.FlexRow gap={8}>
                {/* availability */}
                <StatusChip availability="AVAILABLE" />
                {/* spotify */}
                {trackData && <StatusMusic track={trackData} />}
              </Layout.FlexRow>
              {/* more */}
              {isMyProfile ? (
                <button type="button" onClick={handleClickEditCheckIn}>
                  {/* 더보기 TODO(Gina): IconButton으로 변환 */}
                  <SvgIcon name="edit" size={24} />
                </button>
              ) : (
                <button type="button" onClick={handleClickViewMore}>
                  {/* 수정 TODO(Gina): IconButton으로 변환  */}
                  <SvgIcon name="dots_menu" color="BASIC_BLACK" size={24} />
                </button>
              )}
            </Layout.FlexRow>
            <Layout.FlexRow
              w="100%"
              justifyContent="space-between"
              gap={8}
              bgColor="BASIC_WHITE"
              outline="GRAY_1"
              ph={8}
              pv={4}
              rounded={12}
            >
              {/* emoji */}
              <EmojiItem emojiString="😋" size={24} bgColor="TRANSPARENT" outline="TRANSPARENT" />
              {/* description */}
              <Font.Body type="14_semibold" numberOfLines={2}>
                Got free boba tea from the new shop at work today!!
              </Font.Body>
            </Layout.FlexRow>
            {/* check in time */}
            <Layout.FlexRow w="100%" justifyContent="flex-end">
              <Font.Body type="12_regular" numberOfLines={2} color="GRAY_3">
                Checked in {convertTimeDiffByString(currentDate, new Date('2023-10-28 12:00:00'))}
              </Font.Body>
            </Layout.FlexRow>
          </>
        ) : (
          <AddNewStatus />
        )}
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default Status;
