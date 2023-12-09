import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainContainer from '@components/_common/main-container/MainContainer';
import MomentUploadCompleteModal from '@components/moment-upload/complete-modal/MomentUploadCompleteModal';
import MomentUploadDescriptionInput from '@components/moment-upload/moment-upload-description-input/MomentUploadDescriptionInput';
import SubHeader from '@components/sub-header/SubHeader';
import { DEFAULT_MARGIN, SCREEN_WIDTH, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { TodayMoment } from '@models/moment';
import { BoundState, useBoundStore } from '@stores/useBoundStore';
import { postTodayMoment, updateTodayMoment } from '@utils/apis/moment';
import { isApp } from '@utils/getUserAgent';
import { areAllValuesNull, deepEqual } from '@utils/validateHelpers';
import MomentUploadMoodInput from '../components/moment-upload/moment-upload-mood-input/MomentUploadMoodInput';

const momentSelector = (state: BoundState) => ({
  todayMoment: state.todayMoment,
  fetchTodayMoment: state.fetchTodayMoment,
});

const PHOTO_SIZE = SCREEN_WIDTH - DEFAULT_MARGIN * 2;

function MomentUpload() {
  const [t] = useTranslation('translation', { keyPrefix: 'moment_upload' });
  const { todayMoment, fetchTodayMoment } = useBoundStore(momentSelector);
  const postMessage = usePostAppMessage();
  const [draft, setDraft] = useState<TodayMoment>(todayMoment);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const [showComplete, setShowComplete] = useState(false);
  const isPostable = !deepEqual(todayMoment, draft);

  const handlePhotoUpload = () => {
    if (!window?.ReactNativeWebView) return;
    if (todayMoment.photo) return;
    postMessage('NAVIGATE', {
      screenName: 'MomentPhotoUploadScreen',
      params: {
        todayMoment,
        draft,
      },
    });
  };

  const handlePost = async () => {
    // moment 업로드
    try {
      if (!areAllValuesNull(todayMoment)) {
        // updatedData = todayMoment의 이미 값이 있었던 키값은 제외한 객체
        const updatedData: TodayMoment = draft;
        Object.keys(todayMoment).forEach((key) => {
          if (todayMoment[key as keyof TodayMoment] !== null) {
            delete updatedData[key as keyof TodayMoment];
          }
        });
        await updateTodayMoment({
          ...updatedData,
        });
      } else {
        await postTodayMoment({
          ...draft,
        });
      }
      setShowComplete(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectEmoji = (emoji: EmojiClickData) => {
    setDraft({ ...draft, mood: (draft.mood || '') + emoji.emoji });
  };

  useAsyncEffect(async () => {
    const moment = await fetchTodayMoment();
    setDraft(moment);
  }, []);

  return (
    <MainContainer>
      <SubHeader
        title={t('todays_moments')}
        typo="title-large"
        RightComponent={
          <Layout.FlexRow
            ph={12}
            pv={8}
            rounded={12}
            bgColor={isPostable ? 'BLACK' : 'LIGHT_GRAY'}
            justifyContent="center"
          >
            <button type="button" onClick={handlePost}>
              <Font.Body type="14_regular" color={isPostable ? 'WHITE' : 'MEDIUM_GRAY'}>
                {t('post')}
              </Font.Body>
            </button>
          </Layout.FlexRow>
        }
      />
      <Layout.FlexCol
        bgColor="BACKGROUND_COLOR"
        mt={TITLE_HEADER_HEIGHT}
        pt={24}
        pb={68}
        w="100%"
        h="100%"
        ph={DEFAULT_MARGIN}
        gap={16}
        onClick={() => {
          if (emojiPickerVisible) setEmojiPickerVisible(false);
        }}
      >
        {/* emoji */}
        <MomentUploadMoodInput
          mood={draft.mood}
          setMood={(mood) => setDraft({ ...draft, mood })}
          disabled={!!todayMoment.mood}
          isEmojiPickerVisible={emojiPickerVisible}
          setIsEmojiPickerVisible={setEmojiPickerVisible}
        />
        {/* photo */}
        {/*
         *  NOTE
         *  업로드한 photo가 없고 앱이 아닌 경우 disable, 앱인 경우 redirect
         *  웹의 경우 draft의 photo 여부를 볼 필요는 없음 (웹 사진 업로드 불가능)
         */}
        {!isApp ? (
          <Layout.FlexRow
            w="100%"
            alignItems="center"
            rounded={14}
            bgColor="LIGHT_GRAY"
            ph={12}
            pv={24}
          >
            <SvgIcon name="moment_photo_disabled" size={30} />
            <Font.Body ml={8} type="18_regular" color="MEDIUM_GRAY" italic>
              {t('photo_disabled')}
            </Font.Body>
          </Layout.FlexRow>
        ) : (
          <Layout.FlexRow
            w={PHOTO_SIZE}
            h={PHOTO_SIZE}
            alignItems="center"
            rounded={14}
            bgColor="WHITE"
            ph={todayMoment.photo ? 0 : 12}
            pv={todayMoment.photo ? 0 : 24}
            onClick={handlePhotoUpload}
          >
            {todayMoment.photo ? (
              <Layout.FlexRow w="100%" h="100%" style={{ position: 'relative' }}>
                <Layout.Absolute
                  z={1}
                  w="100%"
                  h="100%"
                  style={{
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'lightgray',
                    backgroundBlendMode: 'normal',
                    background:
                      'linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%)',
                  }}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Font.Display type="18_bold" color="WHITE">
                    {t('already_photo_uploaded')}
                  </Font.Display>
                </Layout.Absolute>
                <img
                  src={todayMoment.photo}
                  width="100%"
                  height="100%"
                  alt={`${todayMoment.photo}-moment`}
                />
              </Layout.FlexRow>
            ) : (
              <>
                <SvgIcon name="moment_photo_normal" size={30} />
                <Font.Body ml={8} type="18_regular" color="MEDIUM_GRAY">
                  {t('photo_placeholder')}
                </Font.Body>
              </>
            )}
          </Layout.FlexRow>
        )}
        {/* description */}
        <MomentUploadDescriptionInput
          description={draft.description}
          setDescription={(description) => setDraft({ ...draft, description })}
          disabled={!!todayMoment.description}
        />
      </Layout.FlexCol>
      <MomentUploadCompleteModal isVisible={showComplete} setIsVisible={setShowComplete} />
      {emojiPickerVisible && (
        <Layout.Absolute b={0} l={0} z={5}>
          <EmojiPicker
            width={SCREEN_WIDTH}
            onEmojiClick={handleSelectEmoji}
            autoFocusSearch={false}
            searchDisabled
            previewConfig={{
              showPreview: false,
            }}
          />
        </Layout.Absolute>
      )}
    </MainContainer>
  );
}

export default MomentUpload;
