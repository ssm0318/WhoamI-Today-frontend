import { Layout } from '@design-system';
import { GetMomentResponse } from '@models/api/moment';
import { ShortAnswerQuestion } from '@models/post';
import TheDaysMoments from './the-days-moments/TheDaysMoments';
import TheDaysQuestions from './the-days-questions/TheDaysQuestions';

interface TheDaysDetailProps {
  mt?: number;
  moment?: GetMomentResponse;
  questions?: ShortAnswerQuestion;
  useDeleteButton?: boolean;
}

function TheDaysDetail({ mt, moment, questions, useDeleteButton }: TheDaysDetailProps) {
  return (
    <Layout.FlexCol w="100%" mt={mt} pl={24} pr={24}>
      {moment && <TheDaysMoments moment={moment} useDeleteButton={useDeleteButton} />}
      {/* TODO: The Day's Questions 마크업 */}
      {questions && <TheDaysQuestions />}
    </Layout.FlexCol>
  );
}

export default TheDaysDetail;
