import { Track } from '@spotify/web-api-ts-sdk';
import { useState } from 'react';
import SearchInput from '@components/_common/search-input/SearchInput';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import MusicItem from '@components/music/music-search-bottom-sheet/music-item/MusicItem';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import { Layout, SvgIcon, Typo } from '@design-system';
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
  const spotifyManager = SpotifyManager.getInstance();

  useAsyncEffect(async () => {
    if (!query) {
      setTrackList([]);
      return;
    }
    const tracks = await spotifyManager.searchMusic(query, 10, 0);
    setTrackList(tracks);
  }, [query]);

  const handleSelectTrack = (track: Track) => {
    onChange(track.id);
    setQuery('');
    setTrackList([]);
  };

  return (
    <EditorPopup isOpen={isOpen} onClose={onClose} title="Song">
      <Layout.FlexCol w="100%" gap={12} mb={16}>
        {trackId && (
          <Layout.FlexRow w="100%" gap={8} alignItems="center">
            <Layout.FlexRow style={{ flex: 1, minWidth: 0 }}>
              <SpotifyMusic track={trackId} useAlbumImg fontType="label-large" />
            </Layout.FlexRow>
            <Layout.FlexRow
              style={{ cursor: 'pointer', flexShrink: 0 }}
              onClick={() => onChange('')}
              alignItems="center"
            >
              <SvgIcon name="delete_button" size={20} />
            </Layout.FlexRow>
          </Layout.FlexRow>
        )}

        <SearchInput
          query={query}
          setQuery={setQuery}
          autoFocus={false}
          fontSize={14}
          placeholder="Search for a song, album, or artist..."
        />

        {trackList.length > 0 && (
          <Layout.FlexCol w="100%" gap={8} style={{ maxHeight: 200, overflowY: 'auto' }}>
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

        {query && trackList.length === 0 && (
          <Typo type="body-small" color="MEDIUM_GRAY" textAlign="center">
            No results found
          </Typo>
        )}
      </Layout.FlexCol>
      <VisibilityToggle value={visibility} onChange={onVisibilityChange} />
    </EditorPopup>
  );
}
