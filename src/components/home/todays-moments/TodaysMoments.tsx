import { Trans, useTranslation } from 'react-i18next';
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
    <Layout.FlexCol w="100%" bgColor="BASIC_WHITE" ph="default" pt={24}>
      <Layout.FlexCol bgColor="GRAY_14" rounded={14} w="100%" ph={16} pv={24}>
        <Layout.FlexRow w="100%" justifyContent="center" alignItems="center">
          <Font.Display type="18_bold">{t('todays_moments')}</Font.Display>
        </Layout.FlexRow>
        <Layout.FlexRow w="100%" justifyContent="center" mt={24}>
          <button type="button" onClick={handleClickUploadMoment} disabled={isTodaysMomentExist}>
            <SvgIcon
              name={isTodaysMomentExist ? 'moment_add_disabled' : 'moment_add'}
              size={56}
              fill={isTodaysMomentExist ? 'GRAY_12' : 'PRIMARY'}
            />
          </button>
        </Layout.FlexRow>
        <Layout.FlexRow w="100%" justifyContent="center" mt={12} alignItems="center" gap={2}>
          {isTodaysMomentExist ? (
            <Font.Body type="12_regular" color="GRAY_6">
              {t('already_posted')}
            </Font.Body>
          ) : (
            <Trans
              i18nKey="home.moment.add_moment_description"
              defaults={t('add_moment_description') || ''}
            >
              <>
                <SvgIcon name="moment_mood_normal" size={14} />
                <SvgIcon name="moment_photo_normal" size={14} />
                <SvgIcon name="moment_description_normal" size={14} />
              </>
            </Trans>
          )}
        </Layout.FlexRow>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default TodaysMoments;
