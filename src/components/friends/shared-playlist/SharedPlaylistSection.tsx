import { Track } from '@spotify/web-api-ts-sdk';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SharedPlaylistBottomSheet from '@components/friends/shared-playlist-bottom-sheet/SharedPlaylistBottomSheet';
import MusicDetailBottomSheet from '@components/music/music-detail-bottom-sheet/MusicDetailBottomSheet';
import { SCREEN_HEIGHT } from '@constants/layout';
import { ColorKeys, Colors, Layout, Typo } from '@design-system';
import { useImpressionTracker } from '@hooks/useImpressionTracker';
import { useTrackEvent } from '@hooks/useTrackEvent';
import SpotifyManager from '@libs/SpotifyManager';
import { PlaylistCard, ScrollableCardList } from './SharedPlaylistSection.styled';

export interface SharedTrackUser {
  id: string | number;
  username: string;
  profileImageUrl?: string | null;
}

export interface SharedTrack {
  id: string | number;
  name: string;
  track: string | Track | null;
  sharedBy: SharedTrackUser;
  sharedByList?: SharedTrackUser[];
}

interface SharedPlaylistSectionProps {
  tracks?: SharedTrack[];
  /**
   * If set, truncates the inline strip after this many tracks and shows a
   * "View all" link that opens the full list in a bottom sheet. Omit (the
   * default) to render every track inline in the horizontal scroll — the
   * Daily Digest expects the whole batch to be browsable directly.
   */
  viewAllMinCount?: number;
  viewAllColor?: ColorKeys;
}

interface TrackCardItemProps {
  track: SharedTrack;
}

function TrackCardItem({ track }: TrackCardItemProps) {
  const [trackData, setTrackData] = useState<Track | null>(null);
  const [trackError, setTrackError] = useState(false);
  const spotifyManager = SpotifyManager.getInstance();
  const [showMusicDetail, setShowMusicDetail] = useState(false);
  const [showListeners, setShowListeners] = useState(false);
  const navigate = useNavigate();
  const trackEvent = useTrackEvent();
  const [t] = useTranslation('translation', { keyPrefix: 'shared_playlist' });
  const listeners = track.sharedByList?.length ? track.sharedByList : [track.sharedBy];

  const handleClickTrack = () => {
    trackEvent('shared_playlist_track_tapped');
    setShowMusicDetail(true);
  };

  const handleClickListeners = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent('shared_playlist_profile_pic_tapped');
    if (listeners.length > 1) {
      setShowListeners(true);
      return;
    }
    navigate(`/users/${listeners[0].username}`, {
      state: { source: 'shared_playlist' },
    });
  };

  const handleClickListenerRow = (username: string) => {
    setShowListeners(false);
    navigate(`/users/${username}`, {
      state: { source: 'shared_playlist' },
    });
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

      <ListenerStack
        role="button"
        tabIndex={0}
        onClick={handleClickListeners}
        onKeyDown={(e) =>
          e.key === 'Enter' && handleClickListeners(e as unknown as React.MouseEvent)
        }
      >
        {listeners.slice(0, 3).map((listener, index) => (
          <ListenerAvatar
            key={`${track.id}-${listener.id}`}
            $index={index}
            $total={Math.min(listeners.length, 3)}
            $size={PROFILE_SIZE + PROFILE_BORDER * 2}
          >
            <ProfileImage
              imageUrl={listener.profileImageUrl}
              username={listener.username}
              size={PROFILE_SIZE}
            />
          </ListenerAvatar>
        ))}
      </ListenerStack>
      <MusicDetailBottomSheet
        visible={showMusicDetail}
        closeBottomSheet={() => {
          setShowMusicDetail(false);
        }}
        track={trackData}
      />
      {showListeners &&
        createPortal(
          <BottomModal
            visible={showListeners}
            onClose={() => setShowListeners(false)}
            customHeight={Math.round(SCREEN_HEIGHT * 0.45)}
            draggable
          >
            <Layout.FlexCol w="100%" h="100%">
              <Layout.FlexRow
                w="100%"
                h={44}
                alignItems="center"
                justifyContent="center"
                style={{ borderBottom: '1px solid #F0F0F0', flexShrink: 0 }}
              >
                <Typo type="title-medium" bold>
                  {t('listeners_title')} ({listeners.length})
                </Typo>
              </Layout.FlexRow>
              <Layout.FlexCol w="100%" ph={16} pv={8} style={{ overflowY: 'auto' }}>
                {listeners.map((listener) => (
                  <ListenerRow
                    key={listener.id}
                    type="button"
                    onClick={() => handleClickListenerRow(listener.username)}
                  >
                    <ProfileImage
                      imageUrl={listener.profileImageUrl}
                      username={listener.username}
                      size={40}
                    />
                    <Typo type="body-large" color="BLACK" bold>
                      {listener.username}
                    </Typo>
                  </ListenerRow>
                ))}
              </Layout.FlexCol>
            </Layout.FlexCol>
          </BottomModal>,
          document.getElementById('modal-container') || document.body,
        )}
    </PlaylistCard>
  );
}

function SharedPlaylistSection({
  tracks = [],
  viewAllMinCount,
  viewAllColor = 'PRIMARY',
}: SharedPlaylistSectionProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'shared_playlist' });
  const [showPlaylistDetail, setShowPlaylistDetail] = useState(false);
  const trackEvent = useTrackEvent();
  const sectionRef = useRef<HTMLDivElement>(null);
  // 'browsed' = the section was actually visible long enough to count as
  // user attention (not just rendered above-the-fold and scrolled past).
  // Same threshold as other impression hooks. `track_count` lets us see
  // empty-state impressions vs full ones in the same dashboard.
  useImpressionTracker(sectionRef, 'shared_playlist_browsed', {
    track_count: tracks.length,
  });

  const handleViewAll = () => {
    trackEvent('shared_playlist_view_all_tapped', { track_count: tracks.length });
    setShowPlaylistDetail(true);
  };
  const showViewAll = viewAllMinCount !== undefined && tracks.length >= viewAllMinCount;
  const visibleTracks = showViewAll ? tracks.slice(0, viewAllMinCount) : tracks;

  return (
    <Layout.FlexCol w="100%" mb={12} mt={4} style={{ minWidth: 0 }} ref={sectionRef}>
      <ScrollableCardList gap={18} ph={16}>
        {tracks.length > 0 && (
          <>
            {/* Track Cards */}
            {visibleTracks.map((track) => (
              <TrackCardItem key={track.id} track={track} />
            ))}

            {showViewAll && (
              <Layout.FlexRow p={10} pr={20} style={{ flexShrink: 0 }} onClick={handleViewAll}>
                <Typo type="title-medium" color={viewAllColor}>
                  {t('view_all')}
                </Typo>
              </Layout.FlexRow>
            )}
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

const ListenerStack = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  z-index: 10;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ListenerAvatar = styled.div<{ $index: number; $total: number; $size: number }>`
  position: relative;
  z-index: ${({ $total, $index }) => $total - $index};
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  margin-left: ${({ $index, $size }) => ($index === 0 ? 0 : -($size / 2))}px;
  padding: 2px;
  background-color: ${Colors.WHITE};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ListenerRow = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 8px 0;
  border: 0;
  background: transparent;
  text-align: left;
`;
