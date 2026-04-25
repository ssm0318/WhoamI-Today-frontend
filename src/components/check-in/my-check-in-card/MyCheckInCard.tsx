import { useNavigate } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import FriendPinnedChip from '@components/friends/friend-pinned-chip/FriendPinnedChip';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import MoodPlaceholder from '@components/profile/placeholders/MoodPlaceholder';
import MusicPlaceholder from '@components/profile/placeholders/MusicPlaceholder';
import SocialBatteryPlaceholder from '@components/profile/placeholders/SocialBatteryPlaceholder';
import ThoughtPlaceholder from '@components/profile/placeholders/ThoughtPlaceholder';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { Layout, Typo } from '@design-system';
import { useArchiveCounts } from '@hooks/useArchiveCounts';
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
        <SocialBatteryChip socialBattery={social_battery} compact onClick={goToCheckIn} />
      ) : (
        <SocialBatteryPlaceholder />
      )}
      {hasMood ? (
        <Layout.FlexRow
          bgColor="WHITE"
          pv={4}
          ph={8}
          outline="LIGHT_GRAY"
          alignItems="center"
          rounded={8}
          style={{ flexShrink: 0, cursor: 'pointer' }}
          onClick={goToCheckIn}
        >
          {moodArray.map((emoji, idx) => {
            const dupeCount = moodArray.slice(0, idx).filter((e) => e === emoji).length;
            return (
              <EmojiItem
                key={`${emoji}${dupeCount}`}
                emojiString={emoji}
                size={16}
                ml={idx > 0 ? -4 : undefined}
                z={5 - idx}
                bgColor="TRANSPARENT"
                outline="TRANSPARENT"
              />
            );
          })}
        </Layout.FlexRow>
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
          <Layout.FlexRow alignItems="center" gap={4} style={{ flexShrink: 0 }}>
            <SocialBatteryChip socialBattery={social_battery} compact onClick={goToCheckIn} />
            <Layout.FlexRow
              bgColor="WHITE"
              pv={4}
              ph={8}
              outline="LIGHT_GRAY"
              alignItems="center"
              rounded={8}
              style={{ flexShrink: 0, cursor: 'pointer' }}
              onClick={goToCheckIn}
            >
              {moodArray.map((emoji, idx) => {
                const dupeCount = moodArray.slice(0, idx).filter((e) => e === emoji).length;
                return (
                  <EmojiItem
                    key={`${emoji}${dupeCount}`}
                    emojiString={emoji}
                    size={16}
                    ml={idx > 0 ? -4 : undefined}
                    z={5 - idx}
                    bgColor="TRANSPARENT"
                    outline="TRANSPARENT"
                  />
                );
              })}
            </Layout.FlexRow>
          </Layout.FlexRow>
        )}
      </Layout.FlexRow>

      {/* When placeholders are needed, battery | mood on their own row (full width) */}
      {!bothBatteryAndMoodFilled && (
        <Layout.FlexRow
          w="100%"
          alignItems="center"
          gap={4}
          style={{ flexWrap: 'wrap', minWidth: 0 }}
        >
          {batteryMoodRow}
        </Layout.FlexRow>
      )}

      {/* Thought pill — leading 💭 emoji reads as a quoted thought. */}
      {thought ? (
        <Layout.FlexRow
          bgColor="WHITE"
          pv={4}
          ph={8}
          gap={4}
          outline="LIGHT_GRAY"
          alignItems="center"
          rounded={8}
          style={{ flexShrink: 0, cursor: 'pointer', alignSelf: 'flex-start' }}
          onClick={goToCheckIn}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }} aria-hidden>
            💭
          </span>
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

      <MyPinnedLink />
    </Container>
  );
}

/**
 * Own `📌 Pinned Check-ins (N)` link on the self-card at the top of the
 * Friends feed. Mirrors the friend card layout so the row matches visually.
 * Navigates to `/check-in/archive?tab=pinned` (own archive with pin
 * controls) rather than the read-only `/users/<u>/check-in/pinned` path
 * that FriendPinnedChip uses on friend cards. Always renders (including
 * N=0) so the affordance stays at a predictable position on the card.
 */
function MyPinnedLink() {
  const { pinnedCount } = useArchiveCounts();
  return (
    <Layout.FlexRow alignSelf="flex-start">
      <FriendPinnedChip pinnedCount={pinnedCount} to="/check-in/archive?tab=pinned" />
    </Layout.FlexRow>
  );
}

export default MyCheckInCard;
