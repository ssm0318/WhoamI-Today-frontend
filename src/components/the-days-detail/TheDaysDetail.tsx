import { Layout } from '@design-system';
import TheDaysMoments from './the-days-moments/TheDaysMoments';
import TheDaysQuestions from './the-days-questions/TheDaysQuestions';

function TheDaysDetail() {
  return (
    <Layout.FlexCol w="100%">
      <TheDaysMoments />
      <TheDaysQuestions />
    </Layout.FlexCol>
  );
}

export default TheDaysDetail;
