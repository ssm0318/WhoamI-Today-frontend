import { useTranslation } from 'react-i18next';
import PromptCard from '@components/_common/prompt/PromptCard';
import RecentPromptCard from '@components/_common/prompt/RecentPromptCard';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { TodayQuestionsSelector } from '@stores/todaysQuestions';
import { useBoundStore } from '@stores/useBoundStore';
import { StyledPromptsOfTheDay, StyledRecentPromptsOfTheDay } from './PromptsOfTheDay.styled';

function PromptsOfTheDay() {
  const [t] = useTranslation('translation', { keyPrefix: 'prompts' });
  const { todaysQuestions, fetchTodaysQuestions } = useBoundStore(TodayQuestionsSelector);

  useAsyncEffect(async () => {
    await fetchTodaysQuestions();
  }, []);

  if (!todaysQuestions) return null;
  return (
    <Layout.FlexCol w="100%" p={26}>
      <Typo type="title-medium">{t('prompts_of_the_day.title')}</Typo>
      <StyledPromptsOfTheDay gap={16} pl={12} pb={26} pr={50} w="100%" alignItems="center">
        {todaysQuestions.map((question) => (
          <PromptCard question={question} />
        ))}
      </StyledPromptsOfTheDay>
      <Typo type="title-medium">{t('recent_prompts')}</Typo>
      <StyledRecentPromptsOfTheDay gap={16} pl={12} pb={26} pr={50} w="100%" alignItems="center">
        {todaysQuestions.slice(0, 5).map((question) => (
          <RecentPromptCard question={question} />
        ))}
      </StyledRecentPromptsOfTheDay>
    </Layout.FlexCol>
  );
}

export default PromptsOfTheDay;
