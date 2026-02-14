import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SharedPlaylistBottomSheet from '@components/friends/shared-playlist-bottom-sheet/SharedPlaylistBottomSheet';
import MusicDetailBottomSheet from '@components/music/music-detail-bottom-sheet/MusicDetailBottomSheet';
import MusicSearchBottomSheet from '@components/music/music-search-bottom-sheet/MusicSearchBottomSheet';
import { Layout, SvgIcon, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import SpotifyManager from '@libs/SpotifyManager';
import { shareSong } from '@utils/apis/playlist';
import { AddNewCard, PlaylistCard, ScrollableCardList } from './SharedPlaylistSection.styled';

export interface SharedTrack {
  id: string | number;
  name: string;
  track: string | Track | null;
  sharedBy: {
    id: string | number;
    username: string;
    profileImageUrl?: string | null;
  };
}

interface SharedPlaylistSectionProps {
  tracks?: SharedTrack[];
  onTrackAdded?: () => void;
  onTrackDeleted?: () => void;
}

interface TrackCardItemProps {
  track: SharedTrack;
}

function TrackCardItem({ track }: TrackCardItemProps) {
  const [trackData, setTrackData] = useState<Track | null>(null);
  const spotifyManager = SpotifyManager.getInstance();
  const [showMusicDetail, setShowMusicDetail] = useState(false);

  const handleClickTrack = () => {
    setShowMusicDetail(true);
  };

  useEffect(() => {
    if (!track.track) {
      setTrackData(null);
      return;
    }
    if (typeof track.track !== 'string') {
      setTrackData(track.track);
      return;
    }
    spotifyManager
      .getTrack(track.track)
      .then((data) => {
        setTrackData(data);
      })
      .catch(() => {
        setTrackData(null);
      });
  }, [spotifyManager, track.track]);

  const albumArtUrl = trackData?.album?.images?.[0]?.url;

  return (
    <PlaylistCard onClick={handleClickTrack}>
      {/* Album Art Background */}
      <Layout.LayoutBase
        p={5}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#EEE6F4',
          borderRadius: 12,
        }}
      >
        {albumArtUrl && (
          <img
            src={albumArtUrl}
            alt={track.name}
            width={76}
            height={76}
            style={{ objectFit: 'cover', borderRadius: 12 }}
          />
        )}
      </Layout.LayoutBase>

      {/* Overlaid Profile Picture - positioned relative to PlaylistCard */}
      <div
        style={{
          position: 'absolute',
          top: -10,
          right: -10,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 47,
            height: 47,
            padding: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#D9D9D9',
            borderRadius: '50%',
          }}
        >
          <ProfileImage
            imageUrl={track.sharedBy.profileImageUrl}
            username={track.sharedBy.username}
            size={41}
          />
        </div>
      </div>
      <MusicDetailBottomSheet
        visible={showMusicDetail}
        closeBottomSheet={() => {
          setShowMusicDetail(false);
        }}
        track={trackData}
      />
    </PlaylistCard>
  );
}

function SharedPlaylistSection({
  tracks = [],
  onTrackAdded,
  onTrackDeleted,
}: SharedPlaylistSectionProps) {
  const sendMessage = usePostAppMessage();
  const [t] = useTranslation('translation', { keyPrefix: 'shared_playlist' });
  const [showMusicSearch, setShowMusicSearch] = useState(false);
  const [showPlaylistDetail, setShowPlaylistDetail] = useState(false);

  const handleCreateNew = () => {
    setShowMusicSearch(true);
  };

  const handleSelectTrackToAdd = async (trackId: string) => {
    try {
      await shareSong(trackId);
      setShowMusicSearch(false);
      if (window.ReactNativeWebView) {
        sendMessage('WIDGET_DATA_UPDATED', {});
      }
      onTrackAdded?.();
    } catch (error) {
      console.error('Error sharing song:', error);
    }
  };

  const handleViewAll = () => {
    setShowPlaylistDetail(true);
  };

  return (
    <Layout.FlexCol w="100%" mb={8} mt={4} style={{ overflow: 'visible' }}>
      <ScrollableCardList gap={18} ph={16}>
        {/* Add New Playlist */}
        <AddNewCard onClick={handleCreateNew}>
          <Layout.FlexCol w="100%" h="100%" alignItems="center" justifyContent="center">
            <SvgIcon name="add_playlist" size={60} color="PRIMARY" />
          </Layout.FlexCol>
        </AddNewCard>

        {/* Empty State or Track Cards */}
        {tracks.length === 0 ? (
          <Layout.FlexRow style={{ flexShrink: 0 }} alignItems="center">
            <Typo type="title-medium" color="PRIMARY">
              {t('empty_message')}
            </Typo>
          </Layout.FlexRow>
        ) : (
          <>
            {/* Track Cards */}
            {tracks.map((track) => (
              <TrackCardItem key={track.id} track={track} />
            ))}

            {/* View all */}
            <Layout.FlexRow p={10} style={{ flexShrink: 0 }} onClick={handleViewAll}>
              <Typo type="title-medium" color="PRIMARY">
                {t('view_all')}
              </Typo>
            </Layout.FlexRow>
          </>
        )}
      </ScrollableCardList>

      {/* Music Search Bottom Sheet */}
      <MusicSearchBottomSheet
        visible={showMusicSearch}
        closeBottomSheet={() => setShowMusicSearch(false)}
        onSelect={handleSelectTrackToAdd}
      />

      {/* Shared Playlist Detail Bottom Sheet */}
      <SharedPlaylistBottomSheet
        visible={showPlaylistDetail}
        closeBottomSheet={() => setShowPlaylistDetail(false)}
        tracks={tracks}
        onAddNew={() => {
          setShowPlaylistDetail(false);
          setShowMusicSearch(true);
        }}
        onTrackDeleted={onTrackDeleted}
      />
    </Layout.FlexCol>
  );
}

export default SharedPlaylistSection;
