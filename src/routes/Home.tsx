import Divider from '@components/_common/divider/Divider';
import TodaysMoments from '@components/home/todays-moments/TodaysMoments';
import TodaysQuestions from '@components/home/todays-questions/TodaysQuestions';

function Home() {
  return (
    <>
      <TodaysMoments />
      <Divider width={2} />
      <TodaysQuestions />
    </>
  );
}

export default Home;
