import { useTranslation } from 'react-i18next';
import MainContainer from '@components/_common/main-container/MainContainer';
import TitleHeader from '@components/title-header/TitleHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';

function TodaysMoment() {
  const [t] = useTranslation('translation', { keyPrefix: 'moment_upload' });

  const isPostable = false;

  // TODO logic 추가
  //   // const handleClickUploadMoment = () => {
  //   if (todayMoment[name]) return;
  //   // 사진 업로드의 경우 앱 화면으로 이동
  //   if (name === 'photo') {
  //     // 사진 업로드의 경우 앱 화면으로 이동
  //     if (!window?.ReactNativeWebView) return;
  //     postMessage('NAVIGATE', {
  //       screenName: 'MomentPhotoUploadScreen',
  //       params: {
  //         state: todayMoment,
  //       },
  //     });
  //   } else {
  //     navigate('/moment-upload', { state: name });
  //   }
  // };

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
            pv={4}
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
        bgColor="GRAY_2"
        mt={TITLE_HEADER_HEIGHT}
        pt={24}
        w="100%"
        h="100%"
        ph={DEFAULT_MARGIN}
        gap={16}
      >
        {/* emoji */}
        <Layout.FlexRow
          w="100%"
          justifyContent="space-between"
          rounded={14}
          bgColor="BASIC_WHITE"
          ph={12}
          pv={24}
        >
          <SvgIcon name="moment_mood_normal" size={30} />
        </Layout.FlexRow>
        {/* photo */}
        <Layout.FlexRow
          w="100%"
          justifyContent="space-between"
          rounded={14}
          bgColor="BASIC_WHITE"
          ph={12}
          pv={24}
        >
          <SvgIcon name="moment_photo_normal" size={30} />
        </Layout.FlexRow>
        {/* description */}
        <Layout.FlexRow
          w="100%"
          justifyContent="space-between"
          rounded={14}
          bgColor="BASIC_WHITE"
          ph={12}
          pv={24}
        >
          <SvgIcon name="moment_description_normal" size={30} />
        </Layout.FlexRow>
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default TodaysMoment;
