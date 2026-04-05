import { Track } from '@spotify/web-api-ts-sdk';
import { EmojiClickData } from 'emoji-picker-react';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CheckInDescription from '@components/check-in/check-in-edit/check-in-description/CheckInDescription';
import CheckInEmoji from '@components/check-in/check-in-edit/check-in-emoji/CheckInEmoji';
import CheckInSocialBattery from '@components/check-in/check-in-edit/check-in-social-battery/CheckInSocialBattery';
import CheckInSpotifyMusic from '@components/check-in/check-in-edit/check-in-spotify-music/CheckInSpotifyMusic';
import SectionContainer from '@components/check-in/check-in-edit/section-container/SectionContainer';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import SubHeader from '@components/sub-header/SubHeader';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import { useGetAppMessage, usePostAppMessage } from '@hooks/useAppMessage';
import useAsyncEffect from '@hooks/useAsyncEffect';
import SpotifyManager from '@libs/SpotifyManager';
import {
  CheckInForm,
  ComponentVisibility,
  DEFAULT_VISIBILITY,
  SocialBattery,
} from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';
import { postCheckIn } from '@utils/apis/checkIn';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import { MainScrollContainer } from '../Root';

function CheckInEdit() {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_edit' });
  const spotifyManager = SpotifyManager.getInstance();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const focusSection = searchParams.get('focus');
  const sendMessage = usePostAppMessage();
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

  // Per-component visibility state
  const [songVisibility, setSongVisibility] = useState<ComponentVisibility>(
    DEFAULT_VISIBILITY.song,
  );
  const [statusVisibility, setStatusVisibility] = useState<ComponentVisibility>(
    DEFAULT_VISIBILITY.mood,
  );
  const [batteryVisibility, setBatteryVisibility] = useState<ComponentVisibility>(
    DEFAULT_VISIBILITY.battery,
  );

  // Refs for deep-linking scroll
  const batteryRef = useRef<HTMLDivElement>(null);
  const songRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

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
      song_visibility: songVisibility,
      mood_visibility: statusVisibility,
      thought_visibility: statusVisibility,
      battery_visibility: batteryVisibility,
    });
    if (window.ReactNativeWebView) {
      sendMessage('WIDGET_DATA_UPDATED', {});
    }
    return navigate('/update');
  };

  useEffect(() => {
    if (!checkInForm.track_id) return setTrackData(null);
    spotifyManager.getTrack(checkInForm.track_id).then(setTrackData);
  }, [spotifyManager, checkInForm]);

  useAsyncEffect(async () => {
    const myCheckIn = await fetchCheckIn();
    if (!myCheckIn) return;
    setCheckInForm(myCheckIn);
    if (myCheckIn.song_visibility) setSongVisibility(myCheckIn.song_visibility);
    if (myCheckIn.mood_visibility) setStatusVisibility(myCheckIn.mood_visibility);
    if (myCheckIn.battery_visibility) setBatteryVisibility(myCheckIn.battery_visibility);
  }, []);

  // Deep-link: scroll to focused section
  useEffect(() => {
    if (!focusSection) return;
    const refMap: Record<string, RefObject<HTMLDivElement>> = {
      battery: batteryRef,
      song: songRef,
      status: statusRef,
    };
    const targetRef = refMap[focusSection];
    if (targetRef?.current) {
      setTimeout(() => {
        targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [focusSection]);

  useGetAppMessage({
    key: 'KEYBOARD_HEIGHT',
    cb: (data) => {
      const newKeyboardVisible = data.height > 0;
      setIsKeyboardVisible(newKeyboardVisible);
      setKeyboardHeight(data.height);

      if (newKeyboardVisible) {
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
        {/* Social Battery */}
        <div ref={batteryRef} style={{ width: '100%' }}>
          <SectionContainer
            title={t('social_battery.title')}
            description={t('social_battery.description')}
          >
            <CheckInSocialBattery
              socialBattery={checkInForm?.social_battery}
              onDelete={() => handleDelete('social_battery')}
              onSelectSocialBattery={handleChangeSocialBattery}
            />
            <Layout.FlexRow mt={8}>
              <VisibilityToggle value={batteryVisibility} onChange={setBatteryVisibility} />
            </Layout.FlexRow>
          </SectionContainer>
        </div>
        {/* Song */}
        <div ref={songRef} style={{ width: '100%' }}>
          <SectionContainer title={t('song.title')} description={t('song.description')}>
            <CheckInSpotifyMusic
              trackData={trackData}
              onDelete={() => handleDelete('track_id')}
              onSelect={(trackId: string) => {
                handleChange('track_id', trackId);
              }}
            />
            <Layout.FlexRow mt={8}>
              <VisibilityToggle value={songVisibility} onChange={setSongVisibility} />
            </Layout.FlexRow>
          </SectionContainer>
        </div>
        {/* Status (emoji & description) */}
        <div ref={statusRef} style={{ width: '100%' }}>
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
            <Layout.FlexRow mt={8}>
              <VisibilityToggle value={statusVisibility} onChange={setStatusVisibility} />
            </Layout.FlexRow>
          </SectionContainer>
        </div>
      </Layout.FlexCol>
    </MainScrollContainer>
  );
}

export default CheckInEdit;
