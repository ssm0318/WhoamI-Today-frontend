import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainContainer from '@components/_common/main-container/MainContainer';
import MomentUploadDescriptionInput from '@components/moment-upload/moment-upload-description-input/MomentUploadDescriptionInput';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, SCREEN_WIDTH, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { TodayMoment } from '@models/moment';
import { BoundState, useBoundStore } from '@stores/useBoundStore';
import { postTodayMoment, updateTodayMoment } from '@utils/apis/moment';
import { isApp } from '@utils/getUserAgent';
import { areAllValuesNull, deepEqual } from '@utils/validateHelpers';
import MomentUploadMoodInput from '../components/moment-upload/moment-upload-mood-input/MomentUploadMoodInput';

const momentSelector = (state: BoundState) => ({
  todayMoment: state.todayMoment,
});

const PHOTO_SIZE = SCREEN_WIDTH - DEFAULT_MARGIN * 2;

function TodaysMoment() {
  const [t] = useTranslation('translation', { keyPrefix: 'moment_upload' });
  const { todayMoment } = useBoundStore(momentSelector);
  const postMessage = usePostAppMessage();
  const [draft, setDraft] = useState<TodayMoment>(todayMoment);

  const isPostable = !deepEqual(todayMoment, draft);

  const handlePhotoUpload = () => {
    // TODO(Gina): 현재 작성한 mood나 description이 있으면 같이 보내서 앱 화면에서도 보이게 처리 필요
    if (!window?.ReactNativeWebView) return;
    if (todayMoment.photo) return;
    postMessage('NAVIGATE', {
      screenName: 'MomentPhotoUploadScreen',
    });
  };

  const handlePost = async () => {
    // moment 업로드
    if (!areAllValuesNull(todayMoment)) {
      await updateTodayMoment({
        ...draft,
      });
    } else {
      await postTodayMoment({
        ...draft,
      });
    }
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
        <MomentUploadMoodInput mood={draft.mood} setMood={(mood) => setDraft({ ...draft, mood })} />
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
                  <Font.Display type="18_bold" color="BASIC_WHITE">
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
                <Font.Body ml={8} type="18_regular" color="GRAY_12">
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
        />
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default TodaysMoment;
