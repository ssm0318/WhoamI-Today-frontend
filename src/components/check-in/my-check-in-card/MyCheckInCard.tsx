import { useNavigate } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import MoodPlaceholder from '@components/profile/placeholders/MoodPlaceholder';
import MusicPlaceholder from '@components/profile/placeholders/MusicPlaceholder';
import SocialBatteryPlaceholder from '@components/profile/placeholders/SocialBatteryPlaceholder';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { SocialBattery } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';
import { Container } from './MyCheckInCard.styled';

function MyCheckInCard() {
  const navigate = useNavigate();

  const { checkIn, fetchCheckIn, myProfile } = useBoundStore((state) => ({
    checkIn: state.checkIn,
    fetchCheckIn: state.fetchCheckIn,
    myProfile: state.myProfile,
  }));

  useAsyncEffect(async () => {
    await fetchCheckIn();
  }, []);

  const { social_battery, track_id, mood, description } = checkIn || {};

  return (
    <Container>
      {/* Row 1: Profile + username + social battery */}
      <Layout.FlexRow w="100%" gap={7} alignItems="center">
        <Layout.FlexRow
          gap={7}
          alignItems="center"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/my')}
        >
          <ProfileImage
            imageUrl={myProfile?.profile_image}
            username={myProfile?.username}
            size={36}
          />
          <Typo type="label-large" ellipsis={{ enabled: true, maxWidth: 100 }}>
            {myProfile?.username || ''}
          </Typo>
        </Layout.FlexRow>
        {social_battery && Object.values(SocialBattery).includes(social_battery) ? (
          <SocialBatteryChip
            socialBattery={social_battery}
            compact
            onClick={() => navigate('/check-in/edit?focus=battery')}
          />
        ) : (
          <SocialBatteryPlaceholder />
        )}
      </Layout.FlexRow>

      {/* Row 2: Status (mood + description) or empty state */}
      {mood || description ? (
        <Layout.FlexRow
          bgColor="WHITE"
          gap={4}
          pv={4}
          ph={8}
          outline="LIGHT_GRAY"
          alignItems="center"
          rounded={8}
          style={{ flexShrink: 0, cursor: 'pointer' }}
          onClick={() => navigate('/check-in/edit?focus=status')}
        >
          {mood && (
            <EmojiItem emojiString={mood} size={16} bgColor="TRANSPARENT" outline="TRANSPARENT" />
          )}
          {description && (
            <Typo type="label-large" numberOfLines={1}>
              {description}
            </Typo>
          )}
        </Layout.FlexRow>
      ) : (
        <MoodPlaceholder />
      )}

      {/* Row 3: Song (full width) or empty state */}
      {track_id ? (
        <Layout.FlexRow w="100%" style={{ minWidth: 0, cursor: 'pointer' }}>
          <SpotifyMusic
            track={track_id}
            useAlbumImg
            fontType="label-large"
            onClick={() => navigate('/check-in/edit?focus=song')}
          />
        </Layout.FlexRow>
      ) : (
        <MusicPlaceholder />
      )}
    </Container>
  );
}

export default MyCheckInCard;
