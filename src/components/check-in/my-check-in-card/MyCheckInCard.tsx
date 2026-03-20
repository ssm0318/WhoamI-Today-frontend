import { useNavigate } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import SpotifyMusic from '@components/music/spotify-music/SpotifyMusic';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { Layout, SvgIcon } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { SocialBattery } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';
import { Container } from './MyCheckInCard.styled';

function MyCheckInCard() {
  const navigate = useNavigate();

  const { checkIn, fetchCheckIn } = useBoundStore((state) => ({
    checkIn: state.checkIn,
    fetchCheckIn: state.fetchCheckIn,
  }));

  useAsyncEffect(async () => {
    await fetchCheckIn();
  }, []);

  const { social_battery, track_id, mood, description } = checkIn || {};

  const hasCheckIn = checkIn && (mood || description || social_battery || track_id);

  const handleClickEdit = () => {
    navigate('/check-in/edit');
  };

  if (!hasCheckIn) return null;

  return (
    <Container>
      <Layout.FlexRow w="100%" style={{ flexWrap: 'wrap' }} gap={4} alignItems="center">
        {/* Music chip */}
        {track_id && (
          <Layout.FlexRow style={{ minWidth: 0, cursor: 'pointer' }}>
            <SpotifyMusic
              track={track_id}
              useAlbumImg
              fontType="body-small"
              onClick={handleClickEdit}
            />
          </Layout.FlexRow>
        )}

        {/* Social battery chip */}
        {social_battery && Object.values(SocialBattery).includes(social_battery) && (
          <SocialBatteryChip socialBattery={social_battery} onClick={handleClickEdit} />
        )}

        {/* Mood + Description chip */}
        {(mood || description) && (
          <Layout.FlexRow
            bgColor="WHITE"
            gap={4}
            pv={4}
            ph={8}
            outline="LIGHT_GRAY"
            alignItems="center"
            rounded={999}
            style={{ flexShrink: 0, cursor: 'pointer' }}
            onClick={handleClickEdit}
          >
            {mood && (
              <EmojiItem emojiString={mood} size={16} bgColor="TRANSPARENT" outline="TRANSPARENT" />
            )}
            {description && (
              <Layout.LayoutBase
                style={{
                  fontSize: 12,
                  lineHeight: '16px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 274,
                }}
              >
                {description}
              </Layout.LayoutBase>
            )}
          </Layout.FlexRow>
        )}
      </Layout.FlexRow>

      {/* Edit arrow */}
      <Layout.Absolute t={12} r={12}>
        <SvgIcon name="edit_filled" fill="DARK_GRAY" size={16} onClick={handleClickEdit} />
      </Layout.Absolute>
    </Container>
  );
}

export default MyCheckInCard;
