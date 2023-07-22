import Divider from '@components/_common/divider/Divider';
import { Layout } from '@design-system';
import { GetMomentResponse } from '@models/api/moment';
import { DayQuestion } from '@models/post';
import TheDaysMoments from './the-days-moments/TheDaysMoments';
import TheDaysQuestions from './the-days-questions/TheDaysQuestions';

interface TheDaysDetailProps {
  mt?: number;
  moment?: GetMomentResponse;
  questions?: DayQuestion[];
  useDeleteButton?: boolean;
  reloadMoment?: () => void;
  reloadQuestions?: () => void;
}

function TheDaysDetail({
  mt,
  moment,
  questions,
  useDeleteButton,
  reloadMoment,
  reloadQuestions,
}: TheDaysDetailProps) {
  const hasQuestions = questions && questions.length > 0;

  // TODO: moment, questions 모두 없는 케이스
  if (!moment && !hasQuestions)
    return (
      <Layout.FlexCol w="100%" mt={mt}>
        TODO: NotFound
      </Layout.FlexCol>
    );

  return (
    <Layout.FlexCol w="100%" mt={mt}>
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
