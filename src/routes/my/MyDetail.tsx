import { format } from 'date-fns';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import TheDaysDetail from '@components/the-days-detail/TheDaysDetail';
import TitleHeader from '@components/title-header/TitleHeader';
import { Font } from '@design-system';
import { getValidDate } from './MyDetail.helper';

function MyDetail() {
  const { detailDate } = useParams();
  const currDate = useMemo(() => getValidDate(detailDate), [detailDate]);

  const navigate = useNavigate();

  useEffect(() => {
    if (currDate) return;
    navigate('/my', { replace: true });
  }, [currDate, navigate]);

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
      <TheDaysDetail />
    </MainContainer>
  );
}

export default MyDetail;
