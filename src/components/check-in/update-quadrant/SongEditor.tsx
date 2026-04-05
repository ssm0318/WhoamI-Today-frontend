import { useState } from 'react';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import SongSearchBottomSheet from '@components/music/music-search-bottom-sheet/MusicSearchBottomSheet';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import { Layout, SvgIcon, Typo } from '@design-system';
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
  const [showSearch, setShowSearch] = useState(false);

  const handleSelect = (id: string) => {
    onChange(id);
    setShowSearch(false);
  };

  return (
    <>
      <EditorPopup isOpen={isOpen} onClose={onClose} title="Song">
        <Layout.FlexCol w="100%" gap={12} mb={16}>
          {trackId ? (
            <Layout.FlexRow w="100%" gap={8} alignItems="center">
              <Layout.FlexRow style={{ flex: 1, minWidth: 0 }}>
                <SpotifyMusic track={trackId} useAlbumImg fontType="label-large" />
              </Layout.FlexRow>
              <Layout.FlexRow
                style={{ cursor: 'pointer', flexShrink: 0 }}
                onClick={() => onChange('')}
                alignItems="center"
                gap={4}
              >
                <SvgIcon name="delete_button" size={20} />
              </Layout.FlexRow>
            </Layout.FlexRow>
          ) : (
            <Layout.FlexRow
              w="100%"
              pv={12}
              ph={16}
              rounded={12}
              outline="LIGHT_GRAY"
              alignItems="center"
              gap={8}
              style={{ cursor: 'pointer' }}
              onClick={() => setShowSearch(true)}
            >
              <SvgIcon name="search" size={20} />
              <Typo type="body-medium" color="LIGHT_GRAY">
                Search for a song
              </Typo>
            </Layout.FlexRow>
          )}
          {trackId && (
            <Layout.FlexRow
              w="100%"
              justifyContent="center"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowSearch(true)}
            >
              <Typo type="label-medium" color="PRIMARY">
                Change song
              </Typo>
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
        <VisibilityToggle value={visibility} onChange={onVisibilityChange} />
      </EditorPopup>
      <SongSearchBottomSheet
        visible={showSearch}
        closeBottomSheet={() => setShowSearch(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
