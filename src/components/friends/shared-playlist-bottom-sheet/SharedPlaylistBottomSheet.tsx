import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, SvgIcon, Typo } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
import { SharedTrack } from '../shared-playlist/SharedPlaylistSection';
import * as S from './SharedPlaylistBottomSheet.styled';

interface SharedPlaylistBottomSheetProps {
  visible: boolean;
  closeBottomSheet: () => void;
  tracks: SharedTrack[];
  onAddNew: () => void;
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
              {isOwner ? t('you_added') : track.sharedBy.username}
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
}: SharedPlaylistBottomSheetProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'shared_playlist.bottom_sheet' });

  const handleAddNew = () => {
    closeBottomSheet();
    onAddNew();
  };

  const handleDeleteTrack = (trackId: string | number) => {
    console.log('delete track:', trackId);
    // TODO: API 호출하여 shared playlist에서 삭제
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
                isOwner={false} // TODO: 현재 사용자가 추가한 트랙인지 확인
                onDelete={() => handleDeleteTrack(track.id)}
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
