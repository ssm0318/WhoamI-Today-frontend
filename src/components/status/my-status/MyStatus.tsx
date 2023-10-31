import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import EmojiItem from '@components/reaction/emoji-item/EmojiItem';
import { Font, Layout } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
import { useBoundStore } from '@stores/useBoundStore';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import StatusChip from '../status-chip/StatusChip';
import StatusMusic from '../status-music/StatusMusic';

// TODO(Gina): 실제 데이터로 바꾸기
function MyStatus() {
  const spotifyManager = SpotifyManager.getInstance();
  const myProfile = useBoundStore((state) => state.myProfile);
  const [currentDate] = useState(() => new Date());
  const trackId = '11dFghVXANMlKmJXsNCbNl';
  const [trackData, setTrackData] = useState<Track | null>(null);

  const { username, profile_image } = myProfile || {};

  useEffect(() => {
    spotifyManager.getTrack(trackId).then(setTrackData);
  }, [spotifyManager]);

  return (
    <Layout.FlexCol gap={8}>
      <Layout.FlexRow gap={8}>
        <ProfileImage imageUrl={profile_image} username={username} size={80} />
        <Layout.FlexCol gap={8}>
          {/* availability */}
          <StatusChip availability="AVAILABLE" />
          {/* bio */}
          <Font.Body type="14_regular" numberOfLines={2}>
            I’m a Bio! Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit ame.
          </Font.Body>
        </Layout.FlexCol>
      </Layout.FlexRow>
      <Layout.FlexCol gap={8} p={16} bgColor="GRAY_14" rounded={8} justifyContent="center">
        <Layout.FlexRow w="100%" alignItems="center" gap={8} justifyContent="space-between">
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

export default MyStatus;
