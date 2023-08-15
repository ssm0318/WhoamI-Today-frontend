import TodaysMoments from '@components/home/todays-moments/TodaysMoments';
import TodaysQuestions from '@components/home/todays-questions/TodaysQuestions';
import { Layout } from '@design-system';

function Home() {
  return (
    <Layout.FlexCol w="100%">
      <TodaysMoments />
      <TodaysQuestions />
    </Layout.FlexCol>
  );
}

export default Home;
