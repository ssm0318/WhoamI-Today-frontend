import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SCREEN_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
import { SharedTrack } from '../shared-playlist/SharedPlaylistSection';
import * as S from './SharedPlaylistBottomSheet.styled';

const BOTTOM_SHEET_HEIGHT = Math.round((SCREEN_HEIGHT - 50) * 0.78);

interface SharedPlaylistBottomSheetProps {
  visible: boolean;
  closeBottomSheet: () => void;
  tracks: SharedTrack[];
}

interface TrackItemProps {
  track: SharedTrack;
}

function TrackItem({ track }: TrackItemProps) {
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
  const artistName = trackData?.artists?.map((a) => a.name).join(', ');

  return (
    <>
      <S.TrackItemContainer>
        <Layout.FlexRow gap={16} flex={1} alignItems="center">
          {/* Album Art with Profile Image */}
          <S.AlbumArtWrapper>
            {albumArtUrl && (
              <img
                src={albumArtUrl}
                alt={track.name}
                width={56}
                height={56}
                style={{ objectFit: 'cover', borderRadius: 6 }}
              />
            )}
            <S.ProfileImageOverlay>
              <ProfileImage
                imageUrl={track.sharedBy.profileImageUrl}
                username={track.sharedBy.username}
                size={24}
              />
            </S.ProfileImageOverlay>
          </S.AlbumArtWrapper>

          {/* Track Info: title + username on same row (username at far right), artist below */}
          <Layout.FlexCol flex={1} gap={4} style={{ minWidth: 0, width: '100%' }}>
            <Layout.FlexRow alignItems="center" justifyContent="space-between" gap={8} w="100%">
              <Layout.FlexCol flex={1} style={{ minWidth: 0, overflow: 'hidden' }}>
                <Typo type="body-large" bold numberOfLines={1}>
                  {trackData?.name || track.name}
                </Typo>
              </Layout.FlexCol>
              <div
                style={{
                  flexShrink: 0,
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typo type="body-small" color="DARK">
                  {track.sharedBy.username}
                </Typo>
              </div>
            </Layout.FlexRow>
            {artistName && (
              <Typo type="body-small" color="MEDIUM_GRAY" numberOfLines={1}>
                {artistName}
              </Typo>
            )}
          </Layout.FlexCol>
        </Layout.FlexRow>
      </S.TrackItemContainer>
      <S.TrackItemSeparator />
    </>
  );
}

function SharedPlaylistBottomSheet({
  visible,
  closeBottomSheet,
  tracks,
}: SharedPlaylistBottomSheetProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'shared_playlist.bottom_sheet' });

  return createPortal(
    <BottomModal
      visible={visible}
      onClose={closeBottomSheet}
      heightMode="full"
      customHeight={BOTTOM_SHEET_HEIGHT}
    >
      <S.Container>
        <Icon name="home_indicator" />
        <Layout.FlexRow w="100%" alignItems="center" ph={16} pv={12}>
          <Typo type="title-large">
            {t('title')} ({tracks.length})
          </Typo>
        </Layout.FlexRow>

        <S.ScrollContainer>
          <Layout.FlexCol w="100%" ph={16} pb={20}>
            {tracks.map((track) => (
              <TrackItem key={track.id} track={track} />
            ))}
          </Layout.FlexCol>
        </S.ScrollContainer>
      </S.Container>
    </BottomModal>,
    document.body,
  );
}

export default SharedPlaylistBottomSheet;
