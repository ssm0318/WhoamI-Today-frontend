import Divider from '@components/_common/divider/Divider';
import { Layout } from '@design-system';
import { GetMomentResponse } from '@models/api/moment';
import { Response } from '@models/post';
import TheDaysMoments from './the-days-moments/TheDaysMoments';
import TheDaysQuestions from './the-days-questions/TheDaysQuestions';

interface TheDaysDetailProps {
  mt?: number;
  moment?: GetMomentResponse;
  responses?: Response[];
  useDeleteButton?: boolean;
}

function TheDaysDetail({ mt, moment, responses, useDeleteButton }: TheDaysDetailProps) {
  return (
    <Layout.FlexCol w="100%" mt={mt}>
      {moment && <TheDaysMoments moment={moment} useDeleteButton={useDeleteButton} />}
      {moment && responses && <Divider width={2} />}
      {responses && <TheDaysQuestions responses={responses} useDeleteButton={useDeleteButton} />}
    </Layout.FlexCol>
  );
}

export default TheDaysDetail;
