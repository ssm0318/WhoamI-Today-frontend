import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, SvgIcon, Typo } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
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
  onCreateNew?: () => void;
  onTrackClick?: (track: SharedTrack) => void;
}

interface TrackCardItemProps {
  track: SharedTrack;
  onClick: () => void;
}

function TrackCardItem({ track, onClick }: TrackCardItemProps) {
  const [trackData, setTrackData] = useState<Track | null>(null);
  const spotifyManager = SpotifyManager.getInstance();

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
    <PlaylistCard onClick={onClick}>
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
    </PlaylistCard>
  );
}

function SharedPlaylistSection({
  tracks = [],
  onCreateNew,
  onTrackClick,
}: SharedPlaylistSectionProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'shared_playlist' });
  const handleCreateNew = () => {
    onCreateNew?.();
  };

  const handleTrackClick = (track: SharedTrack) => {
    onTrackClick?.(track);
  };

  const handleViewAll = () => {
    console.log('view all');
  };

  return (
    <Layout.FlexCol w="100%" style={{ overflow: 'visible' }}>
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
              <TrackCardItem key={track.id} track={track} onClick={() => handleTrackClick(track)} />
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
    </Layout.FlexCol>
  );
}

export default SharedPlaylistSection;
