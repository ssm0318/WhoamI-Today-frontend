import { Track } from '@spotify/web-api-ts-sdk';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ButtonHTMLAttributes, ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import MainContainer from '@components/_common/main-container/MainContainer';
import CheckInTextInput from '@components/check-in/check-in-text-input/CheckInTextInput';
import SpotifyMusic from '@components/check-in/spotify-music/SpotifyMusic';
import SpotifyMusicSearchInput from '@components/check-in/spotify-music-search-input/SpotifyMusicSearchInput';
import AvailabilityChip from '@components/profile/availability-chip/AvailabilityChip';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, SCREEN_WIDTH, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';
import useClickOutside from '@hooks/useClickOutside';
import SpotifyManager from '@libs/SpotifyManager';
import { checkIn as mockCheckIn } from '@mock/users';
import { Availability, CheckIn } from '@models/user';

function CheckInEdit() {
  const spotifyManager = SpotifyManager.getInstance();
  const navigate = useNavigate();

  // TODO(Gina) 현재 status 불러오기
  const [checkIn, setCheckIn] = useState<CheckIn>(mockCheckIn);
  const { availability, bio, description, mood, track_id } = checkIn;
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [trackData, setTrackData] = useState<Track | null>(null);
  const emojiPickerWrapper = useRef<HTMLDivElement>(null);
  const toggleButtonWrapper = useRef<HTMLDivElement>(null);

  const handleSelectEmoji = (e: EmojiClickData) => {
    setCheckIn((prev) => {
      return { ...prev, mood: e.emoji };
    });
    setIsEmojiPickerVisible(false);
  };

  const handleSearchMusic = () => {
    return navigate('/check-in/search-music');
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerVisible((prev) => !prev);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCheckIn((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleDelete = (name: string) => {
    setCheckIn((prev) => {
      return { ...prev, [name]: '' };
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
    spotifyManager.getTrack(track_id).then(setTrackData);
  }, [spotifyManager, track_id]);

  return (
    <MainContainer>
      <TitleHeader
        title="Edit Check-in"
        RightComponent={
          <button type="button" onClick={handleConfirmSave}>
            <Font.Body type="20_semibold" color="PRIMARY">
              Save
            </Font.Body>
          </button>
        }
      />
      <Layout.FlexCol
        mt={TITLE_HEADER_HEIGHT}
        w="100%"
        h="100%"
        gap={16}
        bgColor="BACKGROUND_COLOR"
        p={12}
      >
        {/* emoji */}
        <Layout.FlexCol
          justifyContent="space-between"
          w="100%"
          bgColor="BASIC_WHITE"
          rounded={12}
          p={12}
        >
          <Font.Body type="20_semibold">Select an emoji</Font.Body>
          <Font.Body type="12_semibold" color="GRAY_3">
            What emoji describes you mood the best?
          </Font.Body>
          {mood ? (
            <Layout.FlexRow gap={8} mt={8} alignItems="center">
              <Layout.FlexRow p={8} rounded={12} outline="GRAY_7">
                <EmojiItem emojiString={mood} size={24} outline="TRANSPARENT" />
              </Layout.FlexRow>
              {/* FIXME IconButton으로 변경 */}
              <DeleteButton name="mood" onClick={() => handleDelete('mood')} />
            </Layout.FlexRow>
          ) : (
            <Layout.FlexRow ref={toggleButtonWrapper} mt={8} p={8} rounded={12} outline="GRAY_7">
              {/* FIXME IconButton으로 변경 */}
              <button type="button" onClick={toggleEmojiPicker}>
                <SvgIcon name="add_reaction" size={24} />
              </button>
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
        {/* emoji toggle popup */}
        {isEmojiPickerVisible && (
          <Layout.FlexCol
            style={{
              position: 'relative',
            }}
          >
            <Layout.Absolute t={-16} ref={emojiPickerWrapper}>
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
          </Layout.FlexCol>
        )}
        {/* description */}
        <Layout.FlexCol
          justifyContent="space-between"
          w="100%"
          bgColor="BASIC_WHITE"
          rounded={12}
          p={12}
        >
          <Font.Body type="20_semibold">Enter a short text</Font.Body>
          <Font.Body type="12_semibold" color="GRAY_3">
            Tell your friends more about your mood!
          </Font.Body>
          <Layout.FlexRow mt={8} w="100%" alignItems="center" gap={8}>
            <CheckInTextInput
              name="description"
              value={description}
              onChange={handleChange}
              placeholder="I had amazing ramen for lunch..."
            />
            {description && (
              <DeleteButton name="description" onClick={() => handleDelete('description')} />
            )}
          </Layout.FlexRow>
        </Layout.FlexCol>
        {/* spotify */}
        <Layout.FlexCol
          justifyContent="space-between"
          w="100%"
          bgColor="BASIC_WHITE"
          rounded={12}
          p={12}
        >
          <Font.Body type="20_semibold">Choose a Spotify song</Font.Body>
          <Font.Body type="12_semibold" color="GRAY_3">
            What song describes your mood the best?
          </Font.Body>
          <Layout.FlexRow w="100%" alignItems="center" mt={8} gap={8}>
            {trackData ? (
              <>
                <SpotifyMusic track={trackData} />
                <DeleteButton onClick={() => setTrackData(null)} />
              </>
            ) : (
              <Layout.FlexRow w="100%" onClick={handleSearchMusic}>
                <SpotifyMusicSearchInput />
              </Layout.FlexRow>
            )}
          </Layout.FlexRow>
        </Layout.FlexCol>
        {/* availability */}
        <Layout.FlexCol
          justifyContent="space-between"
          w="100%"
          bgColor="BASIC_WHITE"
          rounded={12}
          p={12}
        >
          <Font.Body type="20_semibold">Availability Availability Availability</Font.Body>
          <Font.Body type="12_semibold" color="GRAY_3">
            Availability Availability Availability
          </Font.Body>
          {Object.values(Availability).map((a) => (
            <AvailabilityChip
              availability={a}
              key={a}
              isSelected={availability === a}
              onSelect={(av) => {
                setCheckIn((prev) => ({ ...prev, availability: av }));
              }}
            />
          ))}
        </Layout.FlexCol>
        {/* bio */}
        <Layout.FlexCol
          justifyContent="space-between"
          w="100%"
          bgColor="BASIC_WHITE"
          rounded={12}
          p={12}
        >
          <Font.Body type="20_semibold">BIO BIO BIO</Font.Body>
          <Font.Body type="12_semibold" color="GRAY_3">
            BIO BIO BIO
          </Font.Body>
          <Layout.FlexRow mt={8} w="100%" alignItems="center" gap={8}>
            <CheckInTextInput name="bio" value={bio} onChange={handleChange} />
            {bio && <DeleteButton name="bio" onClick={() => handleDelete('bio')} />}
          </Layout.FlexRow>
        </Layout.FlexCol>
      </Layout.FlexCol>
    </MainContainer>
  );
}

interface DeleteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

function DeleteButton(props: DeleteButtonProps) {
  return (
    <button type="button" {...props}>
      <SvgIcon name="delete_button" size={16} />
    </button>
  );
}

export default CheckInEdit;
