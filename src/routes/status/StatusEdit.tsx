import { Track } from '@spotify/web-api-ts-sdk';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Divider from '@components/_common/divider/Divider';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import MainContainer from '@components/_common/main-container/MainContainer';
import SpotifyMusic from '@components/check-in/spotify-music/SpotifyMusic';
import AvailabilityChip from '@components/profile/availability-chip/AvailabilityChip';
import SubHeader from '@components/sub-header/SubHeader';
import { DEFAULT_MARGIN, SCREEN_WIDTH, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Font, Input, Layout } from '@design-system';
import useClickOutside from '@hooks/useClickOutside';
import SpotifyManager from '@libs/SpotifyManager';
import { Availability, CheckInBase } from '@models/checkIn';

const AVAILABILITIES: Availability[] = [
  Availability.Available,
  Availability.MayBeSlow,
  Availability.NoStatus,
  Availability.NotAvailable,
];

function StatusEdit() {
  const spotifyManager = SpotifyManager.getInstance();
  const navigate = useNavigate();

  // TODO(Gina) 현재 status 불러오기
  const [status, setStatus] = useState<Partial<CheckInBase>>({
    availability: Availability.Available,
    bio: 'I’m a Bio! Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit ame.',
    description: 'Got free boba tea from the new shop at work today!!',
    mood: '😋',
    track_id: '11dFghVXANMlKmJXsNCbNl',
  });

  const { availability, bio, description, mood, track_id } = status;
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [trackData, setTrackData] = useState<Track | null>(null);
  const emojiPickerWrapper = useRef<HTMLDivElement>(null);
  const toggleButtonWrapper = useRef<HTMLDivElement>(null);

  const handleSelectEmoji = (e: EmojiClickData) => {
    setStatus((prev) => {
      return { ...prev, emoji: e.emoji };
    });
    setIsEmojiPickerVisible(false);
  };

  const handleSearchMusic = () => {
    return navigate('/check-in/search-music');
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerVisible((prev) => !prev);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStatus((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleConfirmSave = () => {
    // TODO(Gina) 저장 API
  };

  useClickOutside({
    ref: emojiPickerWrapper,
    toggleButtonRef: toggleButtonWrapper,
    onClick: () => setIsEmojiPickerVisible(false),
  });

  useEffect(() => {
    if (!track_id) return;
    spotifyManager.getTrack(track_id).then(setTrackData);
  }, [spotifyManager, track_id]);

  return (
    <MainContainer>
      <SubHeader title="Check-in Edit" />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" gap={10} ph="default">
        {/* availability */}
        <Font.Body type="18_regular">Availability</Font.Body>
        {AVAILABILITIES.map((a) => (
          <AvailabilityChip
            availability={a}
            key={a}
            isSelected={availability === a}
            onSelect={(av) => {
              setStatus((prev) => ({ ...prev, availability: av }));
            }}
          />
        ))}
        <Divider width={1} />
        {/* bio */}
        <Input label="Bio" name="bio" value={bio} onChange={handleChange} />
        <Divider width={1} />

        {/* spotify */}
        <Font.Body type="18_regular">Music</Font.Body>
        <Layout.FlexRow justifyContent="space-between" w="100%" alignItems="center">
          {trackData && <SpotifyMusic track={trackData} />}
          <Button.Small
            type="filled"
            status="normal"
            sizing="fit-content"
            onClick={handleSearchMusic}
            text="change music"
          />
        </Layout.FlexRow>
        <Divider width={1} />
        {/* emoji */}
        <Font.Body type="18_regular">Emoji</Font.Body>
        <Layout.FlexRow justifyContent="space-between" w="100%" alignItems="center">
          {mood && <EmojiItem emojiString={mood} size={24} />}
          <Layout.FlexRow ref={toggleButtonWrapper}>
            <Button.Small
              type="filled"
              status="normal"
              sizing="fit-content"
              onClick={toggleEmojiPicker}
              text="change emoji"
            />
          </Layout.FlexRow>
        </Layout.FlexRow>

        <Layout.FlexCol
          style={{
            position: 'relative',
          }}
        >
          {isEmojiPickerVisible && (
            <Layout.Absolute t={0} ref={emojiPickerWrapper}>
              <EmojiPicker
                onEmojiClick={handleSelectEmoji}
                autoFocusSearch={false}
                searchDisabled
                previewConfig={{
                  showPreview: false,
                }}
                height={200}
                width={SCREEN_WIDTH - 2 * DEFAULT_MARGIN}
              />
            </Layout.Absolute>
          )}
        </Layout.FlexCol>
        <Divider width={1} />

        {/* description */}
        <Input label="Description" name="description" value={description} onChange={handleChange} />
      </Layout.FlexCol>
      <Layout.FlexRow w="100%" justifyContent="center" mv="default">
        <Button.Large text="save" onClick={handleConfirmSave} type="filled" status="normal" />
      </Layout.FlexRow>
    </MainContainer>
  );
}

export default StatusEdit;
