import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import { Font, Layout, SvgIcon } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
import { checkIn as mockCheckIn } from '@mock/users';
import { CheckIn as CheckInType, User } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import AvailabilityChip from '../profile/availability-chip/AvailabilityChip';
import AddNewCheckIn from './add-new-check-in/AddNewCheckIn';
import SpotifyMusic from './spotify-music/SpotifyMusic';

interface CheckInProps {
  user: User;
}

function CheckIn({ user }: CheckInProps) {
  const spotifyManager = SpotifyManager.getInstance();
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const isMyPage = user?.id === myProfile?.id;
  const [checkIn, setCheckIn] = useState<CheckInType | null>(mockCheckIn);
  const { availability, track_id } = checkIn || {};

  const [trackData, setTrackData] = useState<Track | null>(null);
  const [currentDate] = useState(() => new Date());
  const navigate = useNavigate();

  const handleClickEditCheckIn = () => {
    return navigate('/check-in/edit');
  };

  const handleClickViewMore = () => {
    // TODO 친구 페이지에서 check-in 더보기
  };

  useEffect(() => {
    if (!track_id) return;
    spotifyManager.getTrack(track_id).then(setTrackData);
  }, [spotifyManager, track_id]);

  useEffect(() => {
    if (!isMyPage) return;
    // isMyPage -> check-in 데이터 부르기
    setCheckIn(mockCheckIn);
  }, [isMyPage]);

  return (
    <Layout.FlexCol w="100%" gap={8} p={16} bgColor="GRAY_14" rounded={8} justifyContent="center">
      {checkIn ? (
        <>
          <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between">
            <Layout.FlexRow gap={8}>
              {/* availability */}
              {availability && <AvailabilityChip availability={availability} />}
              {/* spotify */}
              {trackData && <SpotifyMusic track={trackData} />}
            </Layout.FlexRow>
            {/* more */}
            {isMyPage ? (
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
        <AddNewCheckIn />
      )}
    </Layout.FlexCol>
  );
}

export default CheckIn;
