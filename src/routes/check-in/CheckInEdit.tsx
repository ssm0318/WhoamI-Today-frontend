import { Track } from '@spotify/web-api-ts-sdk';
import { EmojiClickData } from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CheckInDescription from '@components/check-in/check-in-edit/check-in-description/CheckInDescription';
import CheckInEmoji from '@components/check-in/check-in-edit/check-in-emoji/CheckInEmoji';
import CheckInSocialBattery from '@components/check-in/check-in-edit/check-in-social-battery/CheckInSocialBattery';
import CheckInSpotifyMusic from '@components/check-in/check-in-edit/check-in-spotify-music/CheckInSpotifyMusic';
import SectionContainer from '@components/check-in/check-in-edit/section-container/SectionContainer';
import SubHeader from '@components/sub-header/SubHeader';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import { useGetAppMessage } from '@hooks/useAppMessage';
import useAsyncEffect from '@hooks/useAsyncEffect';
import SpotifyManager from '@libs/SpotifyManager';
import { CheckInForm, SocialBattery } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';
import { postCheckIn } from '@utils/apis/checkIn';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import { MainScrollContainer } from '../Root';

function CheckInEdit() {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_edit' });
  const spotifyManager = SpotifyManager.getInstance();
  const navigate = useNavigate();
  const { checkInForm, setCheckInForm, fetchCheckIn } = useBoundStore((state) => ({
    checkInForm: state.checkInForm,
    setCheckInForm: state.setCheckInForm,
    fetchCheckIn: state.fetchCheckIn,
  }));
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isAndroid } = getMobileDeviceInfo();

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

  // useAppMessage 훅을 사용하여 키보드 높이 정보 수신
  useGetAppMessage({
    key: 'KEYBOARD_HEIGHT',
    cb: (data) => {
      const newKeyboardVisible = data.height > 0;
      setIsKeyboardVisible(newKeyboardVisible);
      setKeyboardHeight(data.height);

      // 키보드가 올라올 때 스크롤 조정
      if (newKeyboardVisible) {
        // 약간의 지연을 두고 스크롤 조정 (iOS/Android 호환성)
        setTimeout(() => {
          const { activeElement } = document;
          if (activeElement) {
            activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    },
  });

  return (
    <MainScrollContainer
      scrollRef={scrollContainerRef}
      style={{
        backgroundColor: Colors.BACKGROUND_COLOR,
        paddingBottom:
          isAndroid && isKeyboardVisible ? `${keyboardHeight + BOTTOM_TABBAR_HEIGHT}px` : undefined,
      }}
    >
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
        h="100%"
        w="100%"
        gap={16}
        bgColor="BACKGROUND_COLOR"
        p={12}
        style={{
          paddingBottom: isKeyboardVisible ? `${keyboardHeight + 16}px` : '16px',
        }}
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
    </MainScrollContainer>
  );
}

export default CheckInEdit;
