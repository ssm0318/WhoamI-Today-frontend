import { format } from 'date-fns';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import TheDaysDetail from '@components/the-days-detail/TheDaysDetail';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font } from '@design-system';
import { MOCK_MOMENT } from '@mock/myDetail';
import { getValidDate } from './MyDetail.helper';

function MyDetail() {
  const { detailDate } = useParams();
  const currDate = useMemo(() => getValidDate(detailDate), [detailDate]);

  const navigate = useNavigate();

  useEffect(() => {
    if (currDate) return;
    navigate('/my', { replace: true });
  }, [currDate, navigate]);

  // TODO: moment, questions 요청

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
      <TheDaysDetail moment={MOCK_MOMENT} mt={TITLE_HEADER_HEIGHT} useDeleteButton />
    </MainContainer>
  );
}

export default MyDetail;
