import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import MoodPlaceholder from '@components/profile/placeholders/MoodPlaceholder';
import MusicPlaceholder from '@components/profile/placeholders/MusicPlaceholder';
import SocialBatteryPlaceholder from '@components/profile/placeholders/SocialBatteryPlaceholder';
import ThoughtPlaceholder from '@components/profile/placeholders/ThoughtPlaceholder';
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

  const { social_battery, track_id, mood, thought } = checkIn || {};
  const moodArray: string[] = Array.isArray(mood) ? mood : mood ? [mood] : [];
  const hasMood = moodArray.length > 0;
  const hasBattery = !!social_battery && Object.values(SocialBattery).includes(social_battery);
  const bothBatteryAndMoodFilled = hasBattery && hasMood;

  const goToCheckIn = () => navigate('/update');

  const batteryMoodRow = (
    <>
      {hasBattery ? (
        <SocialBatteryChip
          socialBattery={social_battery}
          compact
          borderless
          onClick={goToCheckIn}
        />
      ) : (
        <SocialBatteryPlaceholder />
      )}
      <InlineDivider />
      {hasMood ? (
        <StackedEmojis onClick={goToCheckIn}>
          {moodArray.map((emoji, idx) => {
            const dupeCount = moodArray.slice(0, idx).filter((e) => e === emoji).length;
            return (
              <StackedEmoji key={`${emoji}${dupeCount}`} $offset={idx}>
                {emoji}
              </StackedEmoji>
            );
          })}
        </StackedEmojis>
      ) : (
        <MoodPlaceholder />
      )}
    </>
  );

  return (
    <Container>
      {/* Top row: avatar + username (ellipsis) + battery | mood — icons follow text, not the row end */}
      <Layout.FlexRow
        w="100%"
        gap={7}
        alignItems="center"
        justifyContent="flex-start"
        style={{ minWidth: 0 }}
      >
        <Layout.FlexRow
          gap={7}
          alignItems="center"
          style={{ cursor: 'pointer', flex: '0 1 auto', minWidth: 0 }}
          onClick={() => navigate('/my')}
        >
          <ProfileImage
            imageUrl={myProfile?.profile_image}
            username={myProfile?.username}
            size={36}
          />
          <div style={{ minWidth: 0, flex: '0 1 auto', overflow: 'hidden' }}>
            <Typo type="label-large" numberOfLines={1}>
              {myProfile?.username || ''}
            </Typo>
          </div>
        </Layout.FlexRow>
        {bothBatteryAndMoodFilled && (
          <Layout.FlexRow alignItems="center" gap={2} style={{ flexShrink: 0 }}>
            <SocialBatteryChip
              socialBattery={social_battery}
              compact
              borderless
              onClick={goToCheckIn}
            />
            <InlineDivider />
            <StackedEmojis onClick={goToCheckIn}>
              {moodArray.map((emoji, idx) => {
                const dupeCount = moodArray.slice(0, idx).filter((e) => e === emoji).length;
                return (
                  <StackedEmoji key={`${emoji}${dupeCount}`} $offset={idx}>
                    {emoji}
                  </StackedEmoji>
                );
              })}
            </StackedEmojis>
          </Layout.FlexRow>
        )}
      </Layout.FlexRow>

      {/* When placeholders are needed, battery | mood on their own row (full width) */}
      {!bothBatteryAndMoodFilled && (
        <Layout.FlexRow
          w="100%"
          alignItems="center"
          gap={2}
          style={{ flexWrap: 'wrap', minWidth: 0 }}
        >
          {batteryMoodRow}
        </Layout.FlexRow>
      )}

      {/* Thought pill */}
      {thought ? (
        <Layout.FlexRow
          bgColor="WHITE"
          pv={4}
          ph={8}
          outline="LIGHT_GRAY"
          alignItems="center"
          rounded={8}
          style={{ flexShrink: 0, cursor: 'pointer', alignSelf: 'flex-start' }}
          onClick={goToCheckIn}
        >
          <Typo type="label-large" numberOfLines={1}>
            {thought}
          </Typo>
        </Layout.FlexRow>
      ) : (
        <div style={{ alignSelf: 'flex-start' }}>
          <ThoughtPlaceholder />
        </div>
      )}

      {/* Song */}
      {track_id ? (
        <Layout.FlexRow w="100%" style={{ minWidth: 0, cursor: 'pointer' }}>
          <SpotifyMusic track={track_id} useAlbumImg fontType="label-large" onClick={goToCheckIn} />
        </Layout.FlexRow>
      ) : (
        <MusicPlaceholder />
      )}
    </Container>
  );
}

const StackedEmojis = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 2px 0;
`;

const StackedEmoji = styled.span<{ $offset: number }>`
  font-size: 16px;
  line-height: 1;
  margin-left: ${({ $offset }) => ($offset > 0 ? '-4px' : '0')};
  z-index: ${({ $offset }) => 5 - $offset};
  position: relative;
`;

const InlineDivider = styled.span`
  width: 1px;
  height: 14px;
  background-color: #d9d9d9;
  margin: 0 2px;
  flex-shrink: 0;
`;

export default MyCheckInCard;
