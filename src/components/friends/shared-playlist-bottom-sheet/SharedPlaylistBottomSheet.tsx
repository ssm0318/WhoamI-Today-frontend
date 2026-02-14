import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, SvgIcon, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import SpotifyManager from '@libs/SpotifyManager';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { unshareSong } from '@utils/apis/playlist';
import { SharedTrack } from '../shared-playlist/SharedPlaylistSection';
import * as S from './SharedPlaylistBottomSheet.styled';

interface SharedPlaylistBottomSheetProps {
  visible: boolean;
  closeBottomSheet: () => void;
  tracks: SharedTrack[];
  onAddNew: () => void;
  onTrackDeleted?: () => void;
}

interface TrackItemProps {
  track: SharedTrack;
  isOwner: boolean;
  onDelete?: () => void;
}

function TrackItem({ track, isOwner, onDelete }: TrackItemProps) {
  const [trackData, setTrackData] = useState<Track | null>(null);
  const spotifyManager = SpotifyManager.getInstance();
  const [t] = useTranslation('translation', { keyPrefix: 'shared_playlist.bottom_sheet' });
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
  // const artistName = trackData?.artists?.[0]?.name;

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

          {/* Track Info */}
          <Layout.FlexCol flex={1} gap={4}>
            <Typo type="body-large" bold numberOfLines={1}>
              {trackData?.name || track.name}
            </Typo>
            <Typo type="body-small" color="MEDIUM_GRAY" numberOfLines={1}>
              {isOwner ? t('you_shared') : track.sharedBy.username}
            </Typo>
          </Layout.FlexCol>
        </Layout.FlexRow>

        {/* Delete Button (only for owner) */}
        {isOwner && onDelete && (
          <S.DeleteButton onClick={onDelete}>
            <SvgIcon name="trash_can" size={24} />
          </S.DeleteButton>
        )}
      </S.TrackItemContainer>
      <S.TrackItemSeparator />
    </>
  );
}

function SharedPlaylistBottomSheet({
  visible,
  closeBottomSheet,
  tracks,
  onAddNew,
  onTrackDeleted,
}: SharedPlaylistBottomSheetProps) {
  const sendMessage = usePostAppMessage();
  const [t] = useTranslation('translation', { keyPrefix: 'shared_playlist.bottom_sheet' });
  const { myProfile } = useBoundStore(UserSelector);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleAddNew = () => {
    closeBottomSheet();
    onAddNew();
  };

  const handleDeleteTrack = async (trackId: string | number) => {
    try {
      setIsDeleting(typeof trackId === 'number' ? trackId : parseInt(trackId.toString(), 10));
      await unshareSong(typeof trackId === 'number' ? trackId : parseInt(trackId.toString(), 10));
      if (window.ReactNativeWebView) {
        sendMessage('WIDGET_DATA_UPDATED', {});
      }
      onTrackDeleted?.();
    } catch (error) {
      console.error('Error deleting track:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const isTrackOwner = (track: SharedTrack) => {
    return myProfile?.id === track.sharedBy.id;
  };

  return createPortal(
    <BottomModal visible={visible} onClose={closeBottomSheet} heightMode="full">
      <S.Container>
        <Icon name="home_indicator" />
        <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center" ph={16} pv={12}>
          <Typo type="title-large">
            {t('title')} ({tracks.length})
          </Typo>
          <S.AddButton onClick={handleAddNew}>
            <SvgIcon name="plus" size={24} />
            <Typo type="title-medium">{t('add')}</Typo>
          </S.AddButton>
        </Layout.FlexRow>

        <S.ScrollContainer>
          <Layout.FlexCol w="100%" ph={16} pb={20}>
            {tracks.map((track) => (
              <TrackItem
                key={track.id}
                track={track}
                isOwner={isTrackOwner(track)}
                onDelete={
                  isTrackOwner(track) && !isDeleting ? () => handleDeleteTrack(track.id) : undefined
                }
              />
            ))}
          </Layout.FlexCol>
        </S.ScrollContainer>
      </S.Container>
    </BottomModal>,
    document.body,
  );
}

export default SharedPlaylistBottomSheet;
