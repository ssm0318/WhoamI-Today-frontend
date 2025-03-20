import { Track } from '@spotify/web-api-ts-sdk';
import { EmojiClickData } from 'emoji-picker-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import CheckInDescription from '@components/check-in/check-in-edit/check-in-description/CheckInDescription';
import CheckInEmoji from '@components/check-in/check-in-edit/check-in-emoji/CheckInEmoji';
import CheckInSocialBattery from '@components/check-in/check-in-edit/check-in-social-battery/CheckInSocialBattery';
import CheckInSpotifyMusic from '@components/check-in/check-in-edit/check-in-spotify-music/CheckInSpotifyMusic';
import SectionContainer from '@components/check-in/check-in-edit/section-container/SectionContainer';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import SpotifyManager from '@libs/SpotifyManager';
import { CheckInForm, SocialBattery } from '@models/checkIn';
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

  const handleChangeSocialBattery = (socialBattery: SocialBattery) => {
    setCheckInForm({ social_battery: socialBattery });
  };

  const handleDelete = (name: string) => {
    setCheckInForm({ [name]: '' });
  };

  const handleConfirmSave = async () => {
    await postCheckIn({
      social_battery: checkInForm.social_battery,
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
        title={t('title')}
        RightComponent={
          <button type="button" onClick={handleConfirmSave}>
            <Typo type="title-medium" color="PRIMARY">
              {t('save')}
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
        {/* Social Bateery */}
        <SectionContainer
          title={t('social_battery.title')}
          description={t('social_battery.description')}
        >
          <CheckInSocialBattery
            socialBattery={checkInForm?.social_battery}
            onDelete={() => handleDelete('social_battery')}
            onSelectSocialBattery={handleChangeSocialBattery}
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
