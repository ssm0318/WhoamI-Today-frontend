import { Track } from '@spotify/web-api-ts-sdk';
import { useState } from 'react';
import SearchInput from '@components/_common/search-input/SearchInput';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import MusicItem from '@components/music/music-search-bottom-sheet/music-item/MusicItem';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import SpotifyManager from '@libs/SpotifyManager';
import { ComponentVisibility } from '@models/checkIn';
import EditorPopup from './EditorPopup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  onChange: (trackId: string) => void;
  visibility: ComponentVisibility;
  onVisibilityChange: (v: ComponentVisibility) => void;
}

export default function SongEditor({
  isOpen,
  onClose,
  trackId,
  onChange,
  visibility,
  onVisibilityChange,
}: Props) {
  const [query, setQuery] = useState('');
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [searchError, setSearchError] = useState('');
  const spotifyManager = SpotifyManager.getInstance();

  useAsyncEffect(async () => {
    if (!query) {
      setTrackList([]);
      setSearchError('');
      return;
    }
    try {
      const tracks = await spotifyManager.searchMusic(query, 10, 0);
      setTrackList(tracks);
      setSearchError('');
    } catch {
      setTrackList([]);
      setSearchError('Search unavailable');
    }
  }, [query]);

  const handleSelectTrack = (track: Track) => {
    // Toggle: tap selected track to deselect, tap new track to select
    onChange(trackId === track.id ? '' : track.id);
  };

  return (
    <EditorPopup isOpen={isOpen} onClose={onClose} title="Song">
      <Layout.FlexCol w="100%" gap={12} mb={16}>
        <SearchInput
          query={query}
          setQuery={setQuery}
          autoFocus={false}
          fontSize={14}
          placeholder="Search for a song, album, or artist..."
        />

        {trackList.length > 0 && (
          <Layout.FlexCol w="100%" gap={8} style={{ maxHeight: 250, overflowY: 'auto' }}>
            {trackList.map((track) => (
              <MusicItem
                key={track.id}
                track={track}
                onSelect={handleSelectTrack}
                selected={trackId === track.id}
              />
            ))}
          </Layout.FlexCol>
        )}

        {searchError && (
          <Typo type="body-small" color="MEDIUM_GRAY" textAlign="center">
            {searchError}
          </Typo>
        )}
        {query && !searchError && trackList.length === 0 && (
          <Typo type="body-small" color="MEDIUM_GRAY" textAlign="center">
            No results found
          </Typo>
        )}
      </Layout.FlexCol>
      <VisibilityToggle value={visibility} onChange={onVisibilityChange} />
    </EditorPopup>
  );
}
