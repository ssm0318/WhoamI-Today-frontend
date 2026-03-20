import { Track } from '@spotify/web-api-ts-sdk';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SharedPlaylistBottomSheet from '@components/friends/shared-playlist-bottom-sheet/SharedPlaylistBottomSheet';
import MusicDetailBottomSheet from '@components/music/music-detail-bottom-sheet/MusicDetailBottomSheet';
import { Layout, Typo } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
import { PlaylistCard, ScrollableCardList } from './SharedPlaylistSection.styled';

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
}

interface TrackCardItemProps {
  track: SharedTrack;
}

function TrackCardItem({ track }: TrackCardItemProps) {
  const [trackData, setTrackData] = useState<Track | null>(null);
  const [trackError, setTrackError] = useState(false);
  const spotifyManager = SpotifyManager.getInstance();
  const [showMusicDetail, setShowMusicDetail] = useState(false);
  const navigate = useNavigate();

  const handleClickTrack = () => {
    setShowMusicDetail(true);
  };

  const handleClickProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${track.sharedBy.username}`);
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
    setTrackError(false);
    spotifyManager
      .getTrack(track.track)
      .then((data) => {
        setTrackData(data);
      })
      .catch(() => {
        setTrackData(null);
        setTrackError(true);
      });
  }, [spotifyManager, track.track]);

  const albumArtUrl = trackData?.album?.images?.[0]?.url;
  const isLoadingTrack = typeof track.track === 'string' && trackData === null && !trackError;

  const ALBUM_SIZE = 100;
  const PROFILE_SIZE = 28;
  const PROFILE_BORDER = 2;

  // Reserve space with placeholder until Spotify track data loads
  if (isLoadingTrack) {
    return (
      <PlaylistCard as="div" style={{ cursor: 'default' }}>
        <div
          style={{
            width: ALBUM_SIZE,
            height: ALBUM_SIZE,
            backgroundColor: '#EEE6F4',
            borderRadius: 12,
          }}
        />
      </PlaylistCard>
    );
  }

  return (
    <PlaylistCard onClick={handleClickTrack}>
      {/* Album Art */}
      <div
        style={{
          width: ALBUM_SIZE,
          height: ALBUM_SIZE,
          backgroundColor: '#EEE6F4',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {albumArtUrl && (
          <img
            src={albumArtUrl}
            alt={track.name}
            width={ALBUM_SIZE}
            height={ALBUM_SIZE}
            style={{ objectFit: 'cover', display: 'block' }}
          />
        )}
      </div>

      {/* Overlaid Profile Picture */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleClickProfile}
        onKeyDown={(e) => e.key === 'Enter' && handleClickProfile(e as unknown as React.MouseEvent)}
        style={{
          position: 'absolute',
          top: -6,
          right: -6,
          zIndex: 10,
          cursor: 'pointer',
          width: PROFILE_SIZE + PROFILE_BORDER * 2,
          height: PROFILE_SIZE + PROFILE_BORDER * 2,
          padding: PROFILE_BORDER,
          backgroundColor: '#FFFFFF',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ProfileImage
          imageUrl={track.sharedBy.profileImageUrl}
          username={track.sharedBy.username}
          size={PROFILE_SIZE}
        />
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

function SharedPlaylistSection({ tracks = [] }: SharedPlaylistSectionProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'shared_playlist' });
  const [showPlaylistDetail, setShowPlaylistDetail] = useState(false);

  const handleViewAll = () => {
    setShowPlaylistDetail(true);
  };

  return (
    <Layout.FlexCol w="100%" mb={12} mt={4} style={{ overflow: 'visible' }}>
      <ScrollableCardList gap={18} ph={16}>
        {tracks.length > 0 && (
          <>
            {/* Track Cards */}
            {tracks.map((track) => (
              <TrackCardItem key={track.id} track={track} />
            ))}

            {/* View all */}
            <Layout.FlexRow p={10} pr={20} style={{ flexShrink: 0 }} onClick={handleViewAll}>
              <Typo type="title-medium" color="PRIMARY">
                {t('view_all')}
              </Typo>
            </Layout.FlexRow>
          </>
        )}
      </ScrollableCardList>

      {/* Shared Playlist Detail Bottom Sheet */}
      <SharedPlaylistBottomSheet
        visible={showPlaylistDetail}
        closeBottomSheet={() => setShowPlaylistDetail(false)}
        tracks={tracks}
      />
    </Layout.FlexCol>
  );
}

export default SharedPlaylistSection;
