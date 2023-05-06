import Divider from '@components/_common/divider/Divider';
import TodaysMoments from '@components/home/todays-moments/TodaysMoments';
import TodaysQuestions from '@components/home/todays-questions/TodaysQuestions';
import { Layout } from '@design-system';

function Home() {
  return (
    <Layout.FlexCol>
      <TodaysMoments />
      <Divider width={2} />
      <TodaysQuestions />
    </Layout.FlexCol>
  );
}

export default Home;
