import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { Layout, SvgIcon, Typo } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';

interface Props {
  track_id: string | undefined;
}

function SpotifyMusic({ track_id }: Props) {
  const [trackData, setTrackData] = useState<Track | null>(null);
  const spotifyManager = SpotifyManager.getInstance();

  useEffect(() => {
    if (!track_id) return setTrackData(null);
    spotifyManager.getTrack(track_id).then(setTrackData);
  }, [spotifyManager, track_id]);

  return (
    <Layout.FlexRow
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
  );
}
export default SpotifyMusic;
