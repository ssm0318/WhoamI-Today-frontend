import { Track } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import BottomModalActionButton from '@components/_common/bottom-modal/BottomModalActionButton';
import Divider from '@components/_common/divider/Divider';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { Layout, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import SpotifyManager from '@libs/SpotifyManager';
import { SocialBattery } from '@models/checkIn';

interface Props {
  visible: boolean;
  closeBottomSheet: () => void;
  username?: string;
  profileImage?: string | null;
  socialBattery?: SocialBattery | null;
  trackId?: string;
  mood?: string;
  description?: string;
}

function CheckInDetailBottomSheet({
  visible,
  closeBottomSheet,
  username,
  profileImage,
  socialBattery,
  trackId,
  mood,
  description,
}: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'music_detail' });
  const postMessage = usePostAppMessage();
  const [trackData, setTrackData] = useState<Track | null>(null);

  useEffect(() => {
    if (!trackId) {
      setTrackData(null);
      return;
    }
    const spotifyManager = SpotifyManager.getInstance();
    spotifyManager
      .getTrack(trackId)
      .then(setTrackData)
      .catch(() => setTrackData(null));
  }, [trackId]);

  const handleClickGoToSpotify = () => {
    if (!trackData) return;
    const url = trackData.external_urls.spotify;
    if (window.ReactNativeWebView) {
      postMessage('OPEN_BROWSER', { url });
    } else {
      window.open(url, '_blank');
    }
  };

  const hasContent = socialBattery || trackId || mood || description;
  if (!hasContent) return null;

  return createPortal(
    <BottomModal visible={visible} onClose={closeBottomSheet}>
      <Layout.FlexCol alignItems="center" w="100%" bgColor="WHITE" pb={trackData ? 100 : 40}>
        <Icon name="home_indicator" />

        {/* User info */}
        {username && (
          <Layout.FlexCol w="100%" alignItems="center">
            <Layout.FlexRow pb={18} gap={7} justifyContent="center" alignItems="center">
              <ProfileImage imageUrl={profileImage} username={username} size={32} />
              <Typo type="title-medium" color="DARK">
                {username}
              </Typo>
            </Layout.FlexRow>
            <Divider width={1} />
          </Layout.FlexCol>
        )}

        {/* Check-in details */}
        <Layout.FlexCol w="100%" gap={16} pt={20} ph={20}>
          {/* Social battery */}
          {socialBattery && Object.values(SocialBattery).includes(socialBattery) && (
            <Layout.FlexRow gap={8} alignItems="center">
              <SocialBatteryChip socialBattery={socialBattery} />
            </Layout.FlexRow>
          )}

          {/* Mood + Description */}
          {(mood || description) && (
            <Layout.FlexRow
              gap={8}
              bgColor="WHITE"
              alignItems="center"
              outline="LIGHT_GRAY"
              ph={12}
              pv={8}
              rounded={12}
            >
              {mood && (
                <EmojiItem
                  emojiString={mood}
                  size={24}
                  bgColor="TRANSPARENT"
                  outline="TRANSPARENT"
                />
              )}
              {description && (
                <Typo type="label-large" numberOfLines={3}>
                  {description}
                </Typo>
              )}
            </Layout.FlexRow>
          )}

          {/* Spotify track */}
          {trackData && (
            <Layout.FlexRow gap={12} alignItems="center">
              <img
                src={trackData.album.images[0].url}
                width={60}
                height={60}
                alt={`${trackData.name}-album`}
                style={{ borderRadius: 4 }}
              />
              <Layout.FlexCol gap={4}>
                <Typo type="title-medium">{trackData.name}</Typo>
                <Typo type="label-medium" color="MEDIUM_GRAY">
                  {trackData.artists[0].name}
                </Typo>
              </Layout.FlexCol>
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>

        {/* Go to Spotify button */}
        {trackData && (
          <Layout.Fixed b={0} w="100%" bgColor="WHITE">
            <Layout.FlexRow w="100%" pt={16} pb={20} ph={12}>
              <BottomModalActionButton
                status="normal"
                text={t('listen_on_spotify')}
                onClick={handleClickGoToSpotify}
              />
            </Layout.FlexRow>
          </Layout.Fixed>
        )}
      </Layout.FlexCol>
    </BottomModal>,
    document.getElementById('modal-container') || document.body,
  );
}

export default CheckInDetailBottomSheet;
