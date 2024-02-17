import { Track } from '@spotify/web-api-ts-sdk';
import { EmojiClickData } from 'emoji-picker-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import MainContainer from '@components/_common/main-container/MainContainer';
import CheckInDescription from '@components/check-in/check-in-edit/check-in-description/CheckInDescription';
import CheckInEmoji from '@components/check-in/check-in-edit/check-in-emoji/CheckInEmoji';
import CheckInSpotifyMusic from '@components/check-in/check-in-edit/check-in-spotify-music/CheckInSpotifyMusic';
import CheckInTextInput from '@components/check-in/check-in-edit/check-in-text-input/CheckInTextInput';
import SectionContainer from '@components/check-in/check-in-edit/section-container/SectionContainer';
import AvailabilityChip from '@components/profile/availability-chip/AvailabilityChip';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout } from '@design-system';
import SpotifyManager from '@libs/SpotifyManager';
import { Availability, CheckInForm } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';
import { postCheckIn } from '@utils/apis/checkIn';

function CheckInEdit() {
  const spotifyManager = SpotifyManager.getInstance();
  const navigate = useNavigate();
  const [checkInForm, setCheckInForm] = useBoundStore((state) => [
    state.checkInForm,
    state.setCheckInForm,
  ]);
  const [trackData, setTrackData] = useState<Track | null>(null);

  const handleSearchMusic = () => {
    return navigate('/check-in/search-music');
  };

  const handleChange = (name: keyof CheckInForm, value: string) => {
    setCheckInForm({ [name]: value });
  };

  const handleChangeAvailability = (availability: Availability) => {
    setCheckInForm({ availability });
  };

  const handleDelete = (name: string) => {
    setCheckInForm({ [name]: '' });
  };

  const handleConfirmSave = async () => {
    await postCheckIn(checkInForm);
    return navigate('/my');
  };

  useEffect(() => {
    if (!checkInForm?.track_id) return;
    spotifyManager.getTrack(checkInForm.track_id).then(setTrackData);
  }, [spotifyManager, checkInForm]);

  return (
    <MainContainer>
      <SubHeader
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
        <SectionContainer
          title="Select an emoji"
          description="What emoji describes you mood the best?"
        >
          <CheckInEmoji
            mood={checkInForm?.mood || ''}
            onDelete={() => handleDelete('mood')}
            onSelectEmoji={(e: EmojiClickData) => {
              handleChange('mood', e.emoji);
            }}
          />
        </SectionContainer>
        {/* description */}
        <SectionContainer
          title="Enter a short text"
          description=" Tell your friends more about your mood!"
        >
          <CheckInDescription
            description={checkInForm?.description || ''}
            onDelete={() => handleDelete('description')}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </SectionContainer>
        {/* spotify */}
        <SectionContainer
          title="Choose a Spotify song"
          description="What song describes your mood the best?"
        >
          <CheckInSpotifyMusic
            trackData={trackData}
            onDelete={() => setTrackData(null)}
            onSearchMusic={handleSearchMusic}
          />
        </SectionContainer>
        {/* FIXME availability */}
        <SectionContainer title="Availability" description="Availability">
          {Object.values(Availability).map((a) => (
            <AvailabilityChip
              availability={a}
              key={a}
              isSelected={checkInForm?.availability === a}
              onSelect={handleChangeAvailability}
            />
          ))}
        </SectionContainer>
        {/* FIXME bio */}
        <SectionContainer title="Bio" description="Bio">
          <Layout.FlexRow mt={8} w="100%" alignItems="center" gap={8}>
            <CheckInTextInput
              value={checkInForm?.bio || ''}
              onChange={(e) => {
                handleChange('bio', e.target.value);
              }}
            />
            {!!checkInForm?.bio && <DeleteButton onClick={() => handleDelete('bio')} />}
          </Layout.FlexRow>
        </SectionContainer>
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default CheckInEdit;
