import { Track } from '@spotify/web-api-ts-sdk';
import { useCallback, useEffect, useState } from 'react';
import SearchInput from '@components/_common/search-input/SearchInput';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import MusicItem from '@components/music/music-search-bottom-sheet/music-item/MusicItem';
import { Layout, SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import SpotifyManager from '@libs/SpotifyManager';
import { ComponentVisibility } from '@models/checkIn';
import {
  getLastVisibility,
  setLastVisibility,
  VisibilityMemoryKeys,
} from '@utils/visibilityMemory';
import EditorPopup from './EditorPopup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onShare: (trackId: string, visibility: ComponentVisibility) => void;
  onArchive?: () => void;
  trackId: string;
  onChange: (trackId: string) => void;
  visibility: ComponentVisibility;
  onVisibilityChange: (v: ComponentVisibility) => void;
}

export default function SongEditor({
  isOpen,
  onClose,
  onShare,
  onArchive,
  trackId,
  onChange,
  visibility,
  onVisibilityChange,
}: Props) {
  const [draftTrackId, setDraftTrackId] = useState<string>(trackId);
  const [draftVisibility, setDraftVisibility] = useState<ComponentVisibility>(
    () => getLastVisibility(VisibilityMemoryKeys.checkInSong) ?? visibility,
  );
  const [query, setQuery] = useState('');
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [searchError, setSearchError] = useState('');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const spotifyManager = SpotifyManager.getInstance();

  const handleVisibilityChange = useCallback((v: ComponentVisibility) => {
    setDraftVisibility(v);
    setLastVisibility(VisibilityMemoryKeys.checkInSong, v);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setDraftTrackId(trackId);
      setDraftVisibility(getLastVisibility(VisibilityMemoryKeys.checkInSong) ?? visibility);
      setQuery('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useAsyncEffect(async () => {
    if (!draftTrackId) {
      setCurrentTrack(null);
      return;
    }
    try {
      const track = await spotifyManager.getTrack(draftTrackId);
      setCurrentTrack(track);
    } catch {
      setCurrentTrack(null);
    }
  }, [draftTrackId]);

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
    setDraftTrackId(draftTrackId === track.id ? '' : track.id);
  };

  const handleShare = useCallback(() => {
    onChange(draftTrackId);
    onVisibilityChange(draftVisibility);
    onShare(draftTrackId, draftVisibility);
  }, [draftTrackId, draftVisibility, onChange, onVisibilityChange, onShare]);

  return (
    <EditorPopup
      isOpen={isOpen}
      onClose={onClose}
      onShare={handleShare}
      onArchive={onArchive}
      title="Song"
    >
      <Layout.FlexCol w="100%" gap={12} mb={16}>
        {currentTrack && !query && (
          <Layout.FlexCol w="100%" gap={8}>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              Currently shared
            </Typo>
            <Layout.FlexRow justifyContent="space-between" w="100%" alignItems="center">
              <Layout.FlexRow gap={12} flex={1}>
                {currentTrack.album.images.length > 0 && currentTrack.album.images[0].url ? (
                  <img
                    src={currentTrack.album.images[0].url}
                    width={44}
                    height={44}
                    alt={`${currentTrack.name}-album`}
                    style={{ borderRadius: 4 }}
                  />
                ) : (
                  <Layout.FlexRow w={44} h={44} bgColor="LIGHT" rounded={4} />
                )}
                <Layout.FlexCol justifyContent="center" w="100%" flex={1}>
                  <Typo type="body-large" numberOfLines={1}>
                    {currentTrack.name}
                  </Typo>
                  <Typo type="body-small" numberOfLines={1} color="MEDIUM_GRAY">
                    {currentTrack.artists[0].name}
                  </Typo>
                </Layout.FlexCol>
              </Layout.FlexRow>
              <Layout.FlexRow onClick={() => setDraftTrackId('')} pl={8} pr={4}>
                <SvgIcon name="close" size={20} color="MEDIUM_GRAY" />
              </Layout.FlexRow>
            </Layout.FlexRow>
          </Layout.FlexCol>
        )}

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
                selected={draftTrackId === track.id}
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
      <VisibilityToggle value={draftVisibility} onChange={handleVisibilityChange} />
    </EditorPopup>
  );
}
