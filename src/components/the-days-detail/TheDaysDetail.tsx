import { useTranslation } from 'react-i18next';
import Divider from '@components/_common/divider/Divider';
import { Loader } from '@components/_common/loader/Loader.styled';
import NoContents from '@components/_common/no-contents/NoContents';
import { Layout } from '@design-system';
import { GetMomentResponse } from '@models/api/moment';
import { DayQuestion } from '@models/post';
import TheDaysMoments from './the-days-moments/TheDaysMoments';
import TheDaysQuestions from './the-days-questions/TheDaysQuestions';

interface TheDaysDetailProps {
  mt?: number;
  isLoading?: boolean;
  moment?: GetMomentResponse | null;
  questions?: DayQuestion[];
  useDeleteButton?: boolean;
  reloadMoment?: () => void;
  reloadQuestions?: () => void;
}

function TheDaysDetail({
  mt,
  isLoading = false,
  moment,
  questions,
  useDeleteButton,
  reloadMoment,
  reloadQuestions,
}: TheDaysDetailProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'no_contents' });
  const hasQuestions = questions && questions.length > 0;

  if (isLoading) return <Loader />;
  return (
    <Layout.FlexCol w="100%" mt={mt}>
      {!moment && !hasQuestions && <NoContents text={t('the_day_detail')} />}
      {moment && (
        <TheDaysMoments
          moment={moment}
          useDeleteButton={useDeleteButton}
          reloadMoment={reloadMoment}
        />
      )}
      {moment && hasQuestions && <Divider width={2} />}
      {hasQuestions && (
        <TheDaysQuestions
          questions={questions}
          useDeleteButton={useDeleteButton}
          reloadQuestions={reloadQuestions}
        />
      )}
    </Layout.FlexCol>
  );
}

export default TheDaysDetail;
