import { Track } from '@spotify/web-api-ts-sdk';
import { EmojiClickData } from 'emoji-picker-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import CheckInAvailability from '@components/check-in/check-in-edit/check-in-availability/CheckInAvailability';
import CheckInDescription from '@components/check-in/check-in-edit/check-in-description/CheckInDescription';
import CheckInEmoji from '@components/check-in/check-in-edit/check-in-emoji/CheckInEmoji';
import CheckInSpotifyMusic from '@components/check-in/check-in-edit/check-in-spotify-music/CheckInSpotifyMusic';
import SectionContainer from '@components/check-in/check-in-edit/section-container/SectionContainer';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import SpotifyManager from '@libs/SpotifyManager';
import { Availability, CheckInForm } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';
import { postCheckIn } from '@utils/apis/checkIn';

function CheckInEdit() {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_edit' });
  const spotifyManager = SpotifyManager.getInstance();
  const navigate = useNavigate();
  const { checkInForm, setCheckInForm, fetchCheckIn } = useBoundStore((state) => ({
    checkInForm: state.checkInForm,
    setCheckInForm: state.setCheckInForm,
    fetchCheckIn: state.fetchCheckIn,
  }));

  const [trackData, setTrackData] = useState<Track | null>(null);

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
    await postCheckIn({
      availability: checkInForm.availability,
      description: checkInForm.description,
      mood: checkInForm.mood,
      track_id: checkInForm.track_id,
    });
    return navigate('/my');
  };

  useEffect(() => {
    if (!checkInForm.track_id) return setTrackData(null);
    spotifyManager.getTrack(checkInForm.track_id).then(setTrackData);
  }, [spotifyManager, checkInForm]);

  useAsyncEffect(async () => {
    const myCheckIn = await fetchCheckIn();
    if (!myCheckIn) return;
    setCheckInForm(myCheckIn);
  }, []);

  return (
    <MainContainer>
      <SubHeader
        title="Edit Check-in"
        RightComponent={
          <button type="button" onClick={handleConfirmSave}>
            <Typo type="title-medium" color="PRIMARY">
              Save
            </Typo>
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
        {/* availability */}
        <SectionContainer
          title={t('availability.title')}
          description={t('availability.description')}
        >
          <CheckInAvailability
            availability={checkInForm?.availability}
            onDelete={() => handleDelete('availability')}
            onSelectAvailability={handleChangeAvailability}
          />
        </SectionContainer>
        {/* spotify */}
        <SectionContainer title={t('song.title')} description={t('song.description')}>
          <CheckInSpotifyMusic
            trackData={trackData}
            onDelete={() => handleDelete('track_id')}
            onSelect={(trackId: string) => {
              handleChange('track_id', trackId);
            }}
          />
        </SectionContainer>
        {/* mood (emoji & description) */}
        <SectionContainer title={t('mood.title')} description={t('mood.description')}>
          <CheckInEmoji
            mood={checkInForm?.mood || ''}
            onDelete={() => handleDelete('mood')}
            onSelectEmoji={(e: EmojiClickData) => {
              handleChange('mood', e.emoji);
            }}
          />
          <CheckInDescription
            description={checkInForm?.description || ''}
            onDelete={() => handleDelete('description')}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </SectionContainer>
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default CheckInEdit;
