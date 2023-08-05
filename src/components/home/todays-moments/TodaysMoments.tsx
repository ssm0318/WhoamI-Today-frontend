import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Font, Layout, SvgIcon } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { BoundState, useBoundStore } from '@stores/useBoundStore';
import { areAllValuesNotNull } from '@utils/validateHelpers';

const momentSelector = (state: BoundState) => ({
  todayMoment: state.todayMoment,
  fetchTodayMoment: state.fetchTodayMoment,
});

function TodaysMoments() {
  const [t] = useTranslation('translation', { keyPrefix: 'home.moment' });
  const { todayMoment, fetchTodayMoment } = useBoundStore(momentSelector);
  const navigate = useNavigate();
  const isTodaysMomentExist = areAllValuesNotNull(todayMoment);

  useAsyncEffect(async () => {
    await fetchTodayMoment();
  }, []);

  const handleClickUploadMoment = () => {
    if (isTodaysMomentExist) return;
    return navigate('/moment-upload');
  };

  return (
    <Layout.FlexCol w="100%" bgColor="BACKGROUND_COLOR" ph={40} pv={48}>
      <Layout.FlexRow w="100%" justifyContent="center" alignItems="center">
        <Font.Display type="18_bold">{t('todays_moments')}</Font.Display>
      </Layout.FlexRow>
      <Layout.FlexRow w="100%" justifyContent="center" mt={24}>
        <button type="button" onClick={handleClickUploadMoment} disabled={isTodaysMomentExist}>
          <SvgIcon name={isTodaysMomentExist ? 'moment_add_disabled' : 'moment_add'} size={56} />
        </button>
      </Layout.FlexRow>
      <Layout.FlexRow w="100%" justifyContent="center" mt={12} alignItems="center" gap={2}>
        {isTodaysMomentExist ? (
          <Font.Body type="12_regular" color="GRAY_6">
            {t('already_posted')}
          </Font.Body>
        ) : (
          <>
            <Font.Body type="12_regular" color="GRAY_6">
              Add
            </Font.Body>
            <SvgIcon name="moment_mood_normal" size={14} />
            <SvgIcon name="moment_photo_normal" size={14} />
            <SvgIcon name="moment_description_normal" size={14} />
            <Font.Body type="12_regular" color="GRAY_6">
              of the day
            </Font.Body>
          </>
        )}
      </Layout.FlexRow>
    </Layout.FlexCol>
  );
}

export default TodaysMoments;
