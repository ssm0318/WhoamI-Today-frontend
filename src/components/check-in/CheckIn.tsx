import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import { Font, Layout, SvgIcon } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import SpotifyManager from '@libs/SpotifyManager';
import { MyCheckIn } from '@models/checkIn';
import { User } from '@models/user';
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
  const {
    myProfile,
    checkIn: initialCheckIn,
    fetchCheckIn,
  } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    checkIn: state.checkIn,
    fetchCheckIn: state.fetchCheckIn,
  }));
  const isMyPage = user?.id === myProfile?.id;
  const [checkIn, setCheckIn] = useState<MyCheckIn | null>(initialCheckIn);
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

  useAsyncEffect(async () => {
    if (!isMyPage) return;
    const myCheckIn = await fetchCheckIn();
    setCheckIn(myCheckIn);
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
              <SvgIcon name="edit_outline" size={24} onClick={handleClickEditCheckIn} />
            ) : (
              <SvgIcon name="dots_menu" color="BLACK" size={24} onClick={handleClickViewMore} />
            )}
          </Layout.FlexRow>
          <Layout.FlexRow
            w="100%"
            gap={8}
            bgColor="WHITE"
            alignItems="center"
            outline="GRAY_1"
            ph={8}
            pv={4}
            rounded={12}
          >
            {/* emoji */}
            <EmojiItem
              emojiString={checkIn.mood}
              size={24}
              bgColor="TRANSPARENT"
              outline="TRANSPARENT"
            />
            {/* description */}
            <Font.Body type="14_semibold" numberOfLines={2}>
              {checkIn.description}
            </Font.Body>
          </Layout.FlexRow>
          {/* check in time */}
          <Layout.FlexRow w="100%" justifyContent="flex-end">
            <Font.Body type="12_regular" numberOfLines={2} color="GRAY_4">
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
