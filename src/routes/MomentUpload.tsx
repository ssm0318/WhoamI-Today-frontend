import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainContainer from '@components/_common/main-container/MainContainer';
import MomentUploadDescriptionInput from '@components/moment-upload/moment-upload-description-input/MomentUploadDescriptionInput';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, SCREEN_WIDTH, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { BoundState, useBoundStore } from '@stores/useBoundStore';
import { isApp } from '@utils/getUserAgent';
import MomentUploadMoodInput from '../components/moment-upload/moment-upload-mood-input/MomentUploadMoodInput';

const momentSelector = (state: BoundState) => ({
  todayMoment: state.todayMoment,
});

const PHOTO_SIZE = SCREEN_WIDTH - DEFAULT_MARGIN * 2;

function TodaysMoment() {
  const [t] = useTranslation('translation', { keyPrefix: 'moment_upload' });
  const { todayMoment } = useBoundStore(momentSelector);
  const postMessage = usePostAppMessage();
  const [mood, setMood] = useState(todayMoment.mood);
  const [description, setDescription] = useState(todayMoment.description);

  const isPostable = false;

  const handlePhotoUpload = () => {
    if (!window?.ReactNativeWebView) return;
    postMessage('NAVIGATE', {
      screenName: 'MomentPhotoUploadScreen',
      params: {
        state: todayMoment,
      },
    });
  };

  const handlePost = () => {
    console.log('TODO POST');
  };

  return (
    <MainContainer>
      <TitleHeader
        title={t('todays_moments')}
        type="SUB"
        RightComponent={
          <Layout.FlexRow
            ph={12}
            pv={8}
            rounded={12}
            bgColor={isPostable ? 'BASIC_BLACK' : 'GRAY_2'}
            justifyContent="center"
          >
            <button type="button" onClick={handlePost}>
              <Font.Body type="14_regular" color={isPostable ? 'BASIC_WHITE' : 'GRAY_12'}>
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
      >
        {/* emoji */}
        <MomentUploadMoodInput mood={mood} setMood={setMood} />
        {/* photo */}
        {/* 앱이 아닌 경우 disable, 앱인 경우 redirect */}
        {!isApp ? (
          <Layout.FlexRow
            w="100%"
            alignItems="center"
            rounded={14}
            bgColor="GRAY_2"
            ph={12}
            pv={24}
          >
            <SvgIcon name="moment_photo_disabled" size={30} />
            <Font.Body ml={8} type="18_regular" color="GRAY_12" italic>
              {t('photo_disabled')}
            </Font.Body>
          </Layout.FlexRow>
        ) : (
          <Layout.FlexRow
            w={PHOTO_SIZE}
            h={PHOTO_SIZE}
            alignItems="center"
            rounded={14}
            bgColor="BASIC_WHITE"
            ph={12}
            pv={24}
            onClick={handlePhotoUpload}
          >
            <SvgIcon name="moment_photo_normal" size={30} />
            {todayMoment.photo ? (
              <Font.Body ml={8} type="18_regular">
                {todayMoment.photo}
              </Font.Body>
            ) : (
              <Font.Body ml={8} type="18_regular" color="GRAY_12">
                {t('photo_placeholder')}
              </Font.Body>
            )}
          </Layout.FlexRow>
        )}
        {/* description */}
        <MomentUploadDescriptionInput description={description} setDescription={setDescription} />
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default TodaysMoment;
