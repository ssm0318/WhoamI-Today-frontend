import { Track } from '@spotify/web-api-ts-sdk';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Divider from '@components/_common/divider/Divider';
import MainContainer from '@components/_common/main-container/MainContainer';
import EmojiItem from '@components/reaction/emoji-item/EmojiItem';
import StatusChip from '@components/status/status-chip/StatusChip';
import StatusMusic from '@components/status/status-music/StatusMusic';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, SCREEN_WIDTH, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Font, Input, Layout } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
import { Availability, Status } from '@models/status';

const AVAILABILITIES: Availability[] = ['AVAILABLE', 'NO_STATUS', 'MAYBE_SLOW', 'NOT_AVAILABLE'];

function StatusEdit() {
  const spotifyManager = SpotifyManager.getInstance();
  const navigate = useNavigate();

  // TODO(Gina) 현재 status 불러오기
  const [status, setStatus] = useState<Status>({
    availability: 'AVAILABLE',
    bio: 'I’m a Bio! Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit ame.',
    description: 'Got free boba tea from the new shop at work today!!',
    emoji: '😋',
    trackId: '11dFghVXANMlKmJXsNCbNl',
  });

  const { availability, bio, description, emoji, trackId } = status;
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [trackData, setTrackData] = useState<Track | null>(null);

  const handleSelectEmoji = (e: EmojiClickData) => {
    setStatus((prev) => {
      return { ...prev, emoji: e.emoji };
    });
  };

  const handleSearchMusic = () => {
    return navigate('/status/search-music');
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

  useEffect(() => {
    spotifyManager.getTrack(trackId).then(setTrackData);
  }, [spotifyManager, trackId]);

  return (
    <MainContainer>
      <TitleHeader title="Check-in Edit" />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" gap={10} ph="default">
        {/* availability */}
        <Font.Body type="18_regular">Availability</Font.Body>
        {AVAILABILITIES.map((a) => (
          <StatusChip
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
          {trackData && <StatusMusic track={trackData} />}
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
          <EmojiItem emojiString={emoji} size={24} />
          <Button.Small
            type="filled"
            status="normal"
            sizing="fit-content"
            onClick={toggleEmojiPicker}
            text="change emoji"
          />
        </Layout.FlexRow>

        <Layout.FlexCol
          style={{
            position: 'relative',
          }}
        >
          {isEmojiPickerVisible && (
            <Layout.Absolute t={0}>
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
        <Input label="Description" name="description" value={description} />
      </Layout.FlexCol>
      <Layout.FlexRow w="100%" justifyContent="center" mv="default">
        <Button.Large text="save" onClick={handleConfirmSave} type="filled" status="normal" />
      </Layout.FlexRow>
    </MainContainer>
  );
}

export default StatusEdit;
