import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import MusicDetailBottomSheet from '@components/music/music-detail-bottom-sheet/MusicDetailBottomSheet';
import { Layout, SvgIcon, Typo } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
import { User } from '@models/user';
import { StyledSpotifyMusic } from './SpotifyMusic.styled';

interface Props {
  track_id: string | undefined;
  sharer?: User;
}

function SpotifyMusic({ track_id, sharer }: Props) {
  const [trackData, setTrackData] = useState<Track | null>(null);
  const spotifyManager = SpotifyManager.getInstance();

  useEffect(() => {
    if (!track_id) return setTrackData(null);
    spotifyManager.getTrack(track_id).then(setTrackData);
  }, [spotifyManager, track_id]);

  const [showMusicDetail, setShowMusicDetail] = useState(false);

  const handleClickMusic = () => {
    setShowMusicDetail(true);
  };

  return (
    <>
      <StyledSpotifyMusic type="button" onClick={handleClickMusic}>
        <Layout.FlexRow
          w="100%"
          outline="SPOTIFY_GREEN"
          rounded={12}
          justifyContent="center"
          alignItems="center"
          pv={4}
          ph={8}
          gap={4}
        >
          <SvgIcon name="spotify" size={16} />
          {trackData && (
            <Typo type="label-medium" numberOfLines={1}>
              {trackData.artists[0].name} - {trackData.name}
            </Typo>
          )}
        </Layout.FlexRow>
      </StyledSpotifyMusic>
      <MusicDetailBottomSheet
        visible={showMusicDetail}
        closeBottomSheet={() => {
          setShowMusicDetail(false);
        }}
        sharer={sharer}
        track={trackData}
      />
    </>
  );
}
export default SpotifyMusic;
