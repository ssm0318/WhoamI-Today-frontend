import { Track } from '@spotify/web-api-ts-sdk';
import { useState } from 'react';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import { Layout } from '@design-system';
import SpotifyMusic from '../../spotify-music/SpotifyMusic';
import CheckInSpotifySearchInput from '../check-in-spotify-search-input/CheckInSpotifySearchInput';
import SongSearchBottomSheet from '../music-search-bottom-sheet/MusicSearchBottomSheet';

interface CheckInSpotifyMusicProps {
  trackData: Track | null;
  onDelete: () => void;
  onSelect: (trackId: string) => void;
}

function CheckInSpotifyMusic({ trackData, onDelete, onSelect }: CheckInSpotifyMusicProps) {
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = () => {
    setShowSearch(true);
  };

  return (
    <>
      <Layout.FlexRow w="100%" alignItems="center" mt={8} gap={8}>
        {trackData ? (
          <>
            <SpotifyMusic
              track={trackData}
              containerStyle={{
                padding: 8,
              }}
            />
            <DeleteButton onClick={onDelete} size={32} />
          </>
        ) : (
          <Layout.FlexRow w="100%" onClick={handleSearch} alignItems="center">
            <CheckInSpotifySearchInput />
          </Layout.FlexRow>
        )}
      </Layout.FlexRow>
      {showSearch && (
        <SongSearchBottomSheet
          visible={showSearch}
          closeBottomSheet={() => {
            setShowSearch(false);
          }}
          onSelect={onSelect}
        />
      )}
    </>
  );
}

export default CheckInSpotifyMusic;
