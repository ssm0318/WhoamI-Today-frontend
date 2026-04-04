import { Track } from '@spotify/web-api-ts-sdk';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { Layout, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import SpotifyManager from '@libs/SpotifyManager';
import { SocialBattery } from '@models/checkIn';
import { getCheckInReactions, toggleCheckInReaction } from '@utils/apis/checkIn';

const REACTION_SHORTCUTS = [
  { emoji: '\u{1F917}', label: 'hug' },
  { emoji: '\u{2764}\u{FE0F}', label: 'heart' },
  { emoji: '\u{1F44D}', label: 'thumbs up' },
  { emoji: '\u{1F525}', label: 'fire' },
  { emoji: '\u{1F680}', label: 'rocket' },
];

interface Props {
  visible: boolean;
  closeBottomSheet: () => void;
  checkInId?: number | null;
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
  checkInId,
  username,
  profileImage,
  socialBattery,
  trackId,
  mood,
  description,
}: Props) {
  useTranslation('translation', { keyPrefix: 'music_detail' });
  const postMessage = usePostAppMessage();
  const [trackData, setTrackData] = useState<Track | null>(null);
  const [selectedReactions, setSelectedReactions] = useState<Set<string>>(new Set());
  const [isToggling, setIsToggling] = useState(false);

  // Fetch existing reactions when the bottom sheet opens
  useEffect(() => {
    if (!visible || !checkInId) {
      setSelectedReactions(new Set());
      return;
    }
    getCheckInReactions(checkInId)
      .then((reactions) => {
        const myEmojis = new Set<string>();
        reactions.forEach((r) => {
          // The ReactionSerializer returns user object with id
          // We check if the reaction belongs to the current user by checking is_mine or
          // matching. Since the list endpoint returns all reactions, we mark ones that
          // are ours. The backend currently returns reactions for the current user only
          // (when not the author), so all returned reactions are ours.
          myEmojis.add(r.emoji);
        });
        setSelectedReactions(myEmojis);
      })
      .catch(() => setSelectedReactions(new Set()));
  }, [visible, checkInId]);

  useEffect(() => {
    if (!visible || !trackId) {
      setTrackData(null);
      return;
    }
    const spotifyManager = SpotifyManager.getInstance();
    spotifyManager
      .getTrack(trackId)
      .then(setTrackData)
      .catch(() => setTrackData(null));
  }, [visible, trackId]);

  const handleClickGoToSpotify = () => {
    if (!trackData) return;
    const url = trackData.external_urls.spotify;
    if (window.ReactNativeWebView) {
      postMessage('OPEN_BROWSER', { url });
    } else {
      window.open(url, '_blank');
    }
  };

  const handleReaction = useCallback(
    async (emoji: string) => {
      if (!checkInId || isToggling) return;

      // Optimistic update
      setSelectedReactions((prev) => {
        const next = new Set(prev);
        if (next.has(emoji)) {
          next.delete(emoji);
        } else {
          next.add(emoji);
        }
        return next;
      });

      setIsToggling(true);
      try {
        const result = await toggleCheckInReaction(checkInId, emoji);
        // Reconcile with server response
        setSelectedReactions((prev) => {
          const next = new Set(prev);
          if (result.toggled === 'on') {
            next.add(emoji);
          } else {
            next.delete(emoji);
          }
          return next;
        });
      } catch {
        // Revert optimistic update on error
        setSelectedReactions((prev) => {
          const next = new Set(prev);
          if (next.has(emoji)) {
            next.delete(emoji);
          } else {
            next.add(emoji);
          }
          return next;
        });
      } finally {
        setIsToggling(false);
      }
    },
    [checkInId, isToggling],
  );

  const hasContent = socialBattery || trackId || mood || description;
  if (!hasContent || !visible) return null;

  return createPortal(
    <Overlay onClick={closeBottomSheet}>
      <PopupContainer onClick={(e) => e.stopPropagation()}>
        {/* Top: Profile + username */}
        {username && (
          <Layout.FlexRow gap={8} alignItems="center" justifyContent="center" pb={12}>
            <ProfileImage imageUrl={profileImage} username={username} size={40} />
            <Typo type="title-medium" color="DARK">
              {username}
            </Typo>
          </Layout.FlexRow>
        )}

        <Divider />

        {/* Middle: Check-in content (largest area) */}
        <Layout.FlexCol gap={16} pv={20} ph={8} alignItems="center" w="100%">
          {/* Social battery */}
          {socialBattery && Object.values(SocialBattery).includes(socialBattery) && (
            <Layout.FlexRow gap={8} alignItems="center">
              <SocialBatteryChip socialBattery={socialBattery} />
            </Layout.FlexRow>
          )}

          {/* Mood + Description */}
          {(mood || description) && (
            <Layout.FlexCol gap={8} alignItems="center" w="100%">
              {mood && (
                <EmojiItem
                  emojiString={mood}
                  size={32}
                  bgColor="TRANSPARENT"
                  outline="TRANSPARENT"
                />
              )}
              {description && (
                <Typo type="body-large" textAlign="center" numberOfLines={5}>
                  {description}
                </Typo>
              )}
            </Layout.FlexCol>
          )}

          {/* Spotify track */}
          {trackData && (
            <TrackCard onClick={handleClickGoToSpotify}>
              <img
                src={trackData.album.images[0]?.url}
                width={56}
                height={56}
                alt={`${trackData.name}-album`}
                style={{ borderRadius: 8 }}
              />
              <Layout.FlexCol gap={2} style={{ flex: 1, minWidth: 0 }}>
                <Typo type="title-medium" numberOfLines={1}>
                  {trackData.name}
                </Typo>
                <Typo type="label-medium" color="MEDIUM_GRAY" numberOfLines={1}>
                  {trackData.artists[0]?.name}
                </Typo>
              </Layout.FlexCol>
            </TrackCard>
          )}
        </Layout.FlexCol>

        <Divider />

        {/* Bottom: Preset reaction shortcuts */}
        <Layout.FlexRow gap={12} pv={12} justifyContent="center" alignItems="center" w="100%">
          {REACTION_SHORTCUTS.map(({ emoji, label }) => (
            <ReactionButton
              key={label}
              $isSelected={selectedReactions.has(emoji)}
              onClick={() => handleReaction(emoji)}
            >
              <span role="img" aria-label={label}>
                {emoji}
              </span>
            </ReactionButton>
          ))}
        </Layout.FlexRow>
      </PopupContainer>
    </Overlay>,
    document.getElementById('modal-container') || document.body,
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
  -webkit-tap-highlight-color: transparent;
`;

const PopupContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  width: 80%;
  max-width: 340px;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.LIGHT_GRAY};
`;

const TrackCard = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 8px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.BACKGROUND_COLOR};
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;

const ReactionButton = styled.div<{ $isSelected: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 22px;
  background-color: ${({ $isSelected }) => ($isSelected ? '#EEE6F4' : 'transparent')};
  border: ${({ $isSelected }) => ($isSelected ? '2px solid #8700FF' : '2px solid transparent')};
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: scale(1.2);
  }
`;

export default CheckInDetailBottomSheet;
