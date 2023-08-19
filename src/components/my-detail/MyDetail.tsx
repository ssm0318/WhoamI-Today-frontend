import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TheDaysDetail from '@components/the-days-detail/TheDaysDetail';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Font, Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { DayQuestion, MomentPost } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getDateRequestParams } from '@utils/apis/common';
import { getDailyMoment } from '@utils/apis/moment';
import { getDayQuestions } from '@utils/apis/responses';

function MyDetail() {
  const { detailDate } = useBoundStore((state) => ({ detailDate: state.detailDate }));

  const params = useMemo(() => {
    if (!detailDate) return;
    return getDateRequestParams(detailDate);
  }, [detailDate]);

  const [moment, setMoment] = useState<FetchState<MomentPost[] | null>>({ state: 'loading' });
  const [questions, setQuestions] = useState<FetchState<DayQuestion[]>>({ state: 'loading' });

  useEffect(() => {
    if (detailDate) return;
    setMoment({ state: 'loading' });
    setQuestions({ state: 'loading' });
  }, [detailDate]);

  const getMoment = useCallback(async () => {
    if (!params) return;
    getDailyMoment(params)
      .then((data) => {
        setMoment({ state: 'hasValue', data: data ? [data] : data });
      })
      .catch(() => {
        setMoment({ state: 'hasError' });
      });
  }, [params]);
  useAsyncEffect(getMoment, [getMoment]);

  const getQuestions = useCallback(async () => {
    if (!params) return;
    getDayQuestions(params)
      .then((data) => {
        setQuestions({ state: 'hasValue', data });
      })
      .catch(() => {
        setQuestions({ state: 'hasError' });
      });
  }, [params]);
  useAsyncEffect(getQuestions, [getQuestions]);

  const [t] = useTranslation('translation', { keyPrefix: 'my_detail' });

  if (!detailDate) return null;
  return (
    <Layout.FlexCol w="100%" pt={15} pb={BOTTOM_TABBAR_HEIGHT}>
      <Layout.FlexRow w="100%" alignItems="center" justifyContent="center">
        <Font.Display type="14_regular">{format(detailDate, t('title_format'))}</Font.Display>
      </Layout.FlexRow>
      <TheDaysDetail
        isLoading={moment.state === 'loading' || questions.state === 'loading'}
        moments={moment?.data}
        questions={questions?.data}
        useDeleteButton
        reloadMoment={getMoment}
        reloadQuestions={getQuestions}
      />
    </Layout.FlexCol>
  );
}

export default MyDetail;
