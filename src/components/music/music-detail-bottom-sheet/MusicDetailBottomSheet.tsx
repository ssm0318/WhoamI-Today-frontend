import { Track } from '@spotify/web-api-ts-sdk';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import BottomModalActionButton from '@components/_common/bottom-modal/BottomModalActionButton';
import Divider from '@components/_common/divider/Divider';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { User } from '@models/user';
import * as S from './MusicDetailBottomSheet.styled';

interface Props {
  track: Track | null;
  sharer?: User;
  visible: boolean;
  closeBottomSheet: () => void;
}

function MusicDetailBottomSheet({ track, sharer, visible, closeBottomSheet }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'music_detail' });
  const postMessage = usePostAppMessage();

  const handleClickGoToSpotify = () => {
    if (!track) return;
    const url = track.external_urls.spotify;
    if (window.ReactNativeWebView) {
      postMessage('OPEN_BROWSER', {
        url,
      });
    } else {
      window.open(url, '_blank');
    }
  };

  return createPortal(
    <BottomModal visible={visible} onClose={closeBottomSheet}>
      <Layout.FlexCol alignItems="center" pb={100} w="100%" bgColor="WHITE">
        {/* sharer info */}
        {sharer && (
          <Layout.FlexCol w="100%" alignItems="center">
            <Layout.FlexRow pb={18} gap={7} justifyContent="center" alignItems="center">
              <ProfileImage imageUrl={sharer.profile_image} username={sharer.username} size={32} />
              <Typo type="title-medium" color="DARK">
                {sharer.username}
              </Typo>
              <Typo type="label-large" color="DARK_GRAY">
                {t('shared_a_song')}
              </Typo>
            </Layout.FlexRow>
            <Divider width={1} />
          </Layout.FlexCol>
        )}
        {/* music info */}
        {track && (
          <Layout.FlexRow
            pt={17}
            ph={20}
            gap={12}
            alignItems="center"
            justifyContent="space-between"
            w="100%"
          >
            <img
              src={track.album.images[0].url}
              width={MUSIC_THUMBNAIL_SIZE}
              height={MUSIC_THUMBNAIL_SIZE}
              alt={`${track.name}-album`}
              style={{
                borderRadius: 4,
              }}
            />
            <Layout.FlexCol gap={5} w="100%">
              <Typo type="title-medium">{track.name}</Typo>
              <Typo type="label-medium">{track.artists[0].name}</Typo>
            </Layout.FlexCol>
          </Layout.FlexRow>
        )}
        {/* bottom button */}
        <Layout.Fixed b={0} w="100%" bgColor="WHITE">
          <S.GoToSpotifyButtonContainer w="100%" pt={16} pb={20} ph={12}>
            <BottomModalActionButton
              status="normal"
              text={t('listen_on_spotify')}
              onClick={handleClickGoToSpotify}
            />
          </S.GoToSpotifyButtonContainer>
        </Layout.Fixed>
      </Layout.FlexCol>
    </BottomModal>,
    document.getElementById('modal-container') || document.body,
  );
}

const MUSIC_THUMBNAIL_SIZE = 102;

export default MusicDetailBottomSheet;
