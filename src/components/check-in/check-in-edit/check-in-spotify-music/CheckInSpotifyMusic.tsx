import { Track } from '@spotify/web-api-ts-sdk';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import { Layout } from '@design-system';
import SpotifyMusic from '../../spotify-music/SpotifyMusic';
import CheckInSpotifySearchInput from '../check-in-spotify-search-input/CheckInSpotifySearchInput';

interface CheckInSpotifyMusicProps {
  trackData: Track | null;
  onDelete: () => void;
  onSearchMusic: () => void;
}

function CheckInSpotifyMusic({ trackData, onDelete, onSearchMusic }: CheckInSpotifyMusicProps) {
  return (
    <Layout.FlexRow w="100%" alignItems="center" mt={8} gap={8}>
      {trackData ? (
        <>
          <SpotifyMusic track={trackData} />
          <DeleteButton onClick={onDelete} />
        </>
      ) : (
        <Layout.FlexRow w="100%" onClick={onSearchMusic} alignItems="center">
          <CheckInSpotifySearchInput />
        </Layout.FlexRow>
      )}
    </Layout.FlexRow>
  );
}

export default CheckInSpotifyMusic;
