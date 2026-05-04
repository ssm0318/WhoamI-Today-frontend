import { KeyboardEvent } from 'react';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { Layout, Typo } from '@design-system';
import { SocialBattery } from '@models/checkIn';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import { CardContainer, ClickableArea, ComponentContent } from './CheckInUpdateCard.styled';

type CheckInComponent = 'battery' | 'mood' | 'thought' | 'song';

interface Props {
  username: string;
  profileImage?: string | null;
  component: CheckInComponent;
  content: string;
  socialBattery?: SocialBattery | null;
  trackId?: string;
  timestamp: string;
  onProfileClick?: () => void;
  onComponentClick?: () => void;
}

const COMPONENT_LABELS: Record<CheckInComponent, string> = {
  battery: 'social battery',
  mood: 'mood',
  thought: 'thought',
  song: 'song',
};

function CheckInUpdateCard({
  username,
  profileImage,
  component,
  content,
  socialBattery,
  trackId,
  timestamp,
  onProfileClick,
  onComponentClick,
}: Props) {
  const moodArray: string[] = component === 'mood' && content ? content.split(',') : [];

  const handleKeyDown = (handler?: () => void) => (event: KeyboardEvent<HTMLDivElement>) => {
    if (!handler) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handler();
  };

  return (
    <CardContainer gap={6} w="100%">
      {/* Header: profile + "username updated their mood" + timestamp */}
      <ClickableArea
        role="button"
        tabIndex={0}
        aria-label={`Open ${username}'s profile`}
        onClick={onProfileClick}
        onKeyDown={handleKeyDown(onProfileClick)}
      >
        <Layout.FlexRow w="100%" alignItems="center" gap={8}>
          <ProfileImage imageUrl={profileImage} username={username} size={28} />
          <Layout.FlexCol style={{ flex: 1, minWidth: 0 }}>
            <Layout.FlexRow alignItems="center" gap={4} style={{ flexWrap: 'wrap' }}>
              <Typo type="label-large" fontWeight={600}>
                {username}
              </Typo>
              <Typo type="label-medium" color="MEDIUM_GRAY">
                updated their {COMPONENT_LABELS[component]}
              </Typo>
            </Layout.FlexRow>
            <Typo type="label-small" color="MEDIUM_GRAY">
              {convertTimeDiffByString({ day: new Date(timestamp) })}
            </Typo>
          </Layout.FlexCol>
        </Layout.FlexRow>
      </ClickableArea>

      {/* Content */}
      <ClickableArea
        role="button"
        tabIndex={0}
        aria-label={`React to ${username}'s ${COMPONENT_LABELS[component]} update`}
        onClick={onComponentClick}
        onKeyDown={handleKeyDown(onComponentClick)}
      >
        <ComponentContent alignItems="center" gap={4}>
          {component === 'battery' && socialBattery && (
            <SocialBatteryChip socialBattery={socialBattery} compact />
          )}
          {component === 'mood' && moodArray.length > 0 && (
            // Match the People-tab card chip styling so the mood reads as a
            // tappable pill (same border / radius / padding as thought + song).
            <Layout.FlexRow
              bgColor="WHITE"
              pv={4}
              ph={8}
              outline="LIGHT_GRAY"
              alignItems="center"
              rounded={8}
              style={{ alignSelf: 'flex-start' }}
            >
              {moodArray.map((emoji, idx) => {
                const dupeCount = moodArray.slice(0, idx).filter((e) => e === emoji).length;
                return (
                  <EmojiItem
                    key={`${emoji}${dupeCount}`}
                    emojiString={emoji.trim()}
                    size={20}
                    ml={idx > 0 ? -4 : undefined}
                    z={5 - idx}
                    bgColor="TRANSPARENT"
                    outline="TRANSPARENT"
                  />
                );
              })}
            </Layout.FlexRow>
          )}
          {component === 'thought' && content && (
            <Layout.FlexRow
              bgColor="WHITE"
              pv={4}
              ph={8}
              gap={4}
              outline="LIGHT_GRAY"
              alignItems="center"
              rounded={8}
              style={{ alignSelf: 'flex-start' }}
            >
              <Typo type="label-large" numberOfLines={2}>
                {content}
              </Typo>
            </Layout.FlexRow>
          )}
          {component === 'song' && trackId && (
            <Layout.FlexRow w="100%" style={{ minWidth: 0, overflow: 'hidden' }}>
              <SpotifyMusic track={trackId} useAlbumImg fontType="label-large" />
            </Layout.FlexRow>
          )}
        </ComponentContent>
      </ClickableArea>
    </CardContainer>
  );
}

export default CheckInUpdateCard;
