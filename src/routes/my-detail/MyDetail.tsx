import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import TheDaysDetail from '@components/the-days-detail/TheDaysDetail';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { DayQuestion, MomentPost } from '@models/post';
import { getDateRequestParams } from '@utils/apis/common';
import { getDailyMoment } from '@utils/apis/moment';
import { getDayQuestions } from '@utils/apis/responses';
import { getValidDate } from './MyDetail.helper';

function MyDetail() {
  const { detailDate } = useParams();
  const currDate = useMemo(() => getValidDate(detailDate), [detailDate]);

  const navigate = useNavigate();

  useEffect(() => {
    if (currDate) return;
    navigate('/my', { replace: true });
  }, [currDate, navigate]);

  const params = useMemo(() => {
    if (!currDate) return;
    return getDateRequestParams(currDate);
  }, [currDate]);

  const [moment, setMoment] = useState<MomentPost>();

  const getMoment = useCallback(async () => {
    if (!params) return;
    getDailyMoment(params)
      .then((data) => {
        setMoment(data ?? undefined);
      })
      .catch(() => {
        setMoment(undefined);
      });
  }, [params]);
  useAsyncEffect(getMoment, [getMoment]);

  const [questions, setQuestions] = useState<DayQuestion[]>();

  const getQuestions = useCallback(async () => {
    if (!params) return;
    const data = await getDayQuestions(params);
    setQuestions(data);
  }, [params]);
  useAsyncEffect(getQuestions, [getQuestions]);

  const [t] = useTranslation('translation', { keyPrefix: 'my_detail' });

  return (
    <MainContainer>
      <TitleHeader
        RightComponent={
          currDate && (
            <Font.Display type="14_regular">{format(currDate, t('title_format'))}</Font.Display>
          )
        }
      />
      <TheDaysDetail
        moment={moment}
        questions={questions}
        mt={TITLE_HEADER_HEIGHT}
        useDeleteButton
        reloadMoment={getMoment}
        reloadQuestions={getQuestions}
      />
    </MainContainer>
  );
}

export default MyDetail;