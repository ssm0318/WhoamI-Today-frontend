import { useNavigate } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
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

  const handleClickBattery = () => navigate('/check-in/edit?focus=battery');
  const handleClickStatus = () => navigate('/check-in/edit?focus=status');
  const handleClickSong = () => navigate('/check-in/edit?focus=song');

  const hasCheckIn = social_battery || track_id || mood || description;

  // When no check-in at all, show compact inline empty-state chips
  if (!hasCheckIn) {
    return (
      <Layout.FlexRow
        w="100%"
        gap={6}
        ph={16}
        pv={10}
        alignItems="center"
        style={{ flexWrap: 'wrap' }}
      >
        <ProfileImage
          imageUrl={myProfile?.profile_image}
          username={myProfile?.username}
          size={32}
        />
        <EmptyChip label="+ My battery" onClick={handleClickBattery} />
        <EmptyChip label="+ Add my music 🎵" onClick={handleClickSong} />
        <EmptyChip label="+ I feel" onClick={handleClickStatus} />
      </Layout.FlexRow>
    );
  }

  return (
    <Container>
      {/* Row 1: Profile + username + social battery */}
      <Layout.FlexRow w="100%" gap={7} alignItems="center">
        <ProfileImage
          imageUrl={myProfile?.profile_image}
          username={myProfile?.username}
          size={36}
        />
        <Typo type="label-large" ellipsis={{ enabled: true, maxWidth: 100 }}>
          {myProfile?.username || ''}
        </Typo>
        {social_battery && Object.values(SocialBattery).includes(social_battery) ? (
          <SocialBatteryChip socialBattery={social_battery} onClick={handleClickBattery} />
        ) : (
          <EmptyChip label="+ My battery" onClick={handleClickBattery} />
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
          rounded={999}
          style={{ flexShrink: 0, cursor: 'pointer' }}
          onClick={handleClickStatus}
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
        <EmptyChip label="+ I feel" onClick={handleClickStatus} />
      )}

      {/* Row 3: Song (full width) or empty state */}
      {track_id ? (
        <Layout.FlexRow w="100%" style={{ minWidth: 0, cursor: 'pointer' }}>
          <SpotifyMusic
            track={track_id}
            useAlbumImg
            fontType="label-large"
            onClick={handleClickSong}
          />
        </Layout.FlexRow>
      ) : (
        <EmptyChip label="+ Add my music 🎵" onClick={handleClickSong} />
      )}
    </Container>
  );
}

function EmptyChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Layout.FlexRow
      pv={4}
      ph={8}
      rounded={999}
      style={{ cursor: 'pointer', border: '1px dashed #BDBDBD' }}
      onClick={onClick}
    >
      <Typo type="label-medium" color="MEDIUM_GRAY">
        {label}
      </Typo>
    </Layout.FlexRow>
  );
}

export default MyCheckInCard;
