import Divider from '@components/_common/divider/Divider';
import TodaysQuestions from '@components/home/todays-questions/TodaysQuestions';

function Home() {
  return (
    <>
      <Divider width={2} />
      <TodaysQuestions />
    </>
  );
}

export default Home;
