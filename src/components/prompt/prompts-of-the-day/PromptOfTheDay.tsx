import { MutableRefObject, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDraggable } from 'react-use-draggable-scroll';
import NoContents from '@components/_common/no-contents/NoContents';
import PromptCard from '@components/_common/prompt/PromptCard';
import RecentPromptCard from '@components/_common/prompt/RecentPromptCard';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { ResponseRequest } from '@models/api/question';
import { TodayQuestionsSelector } from '@stores/todaysQuestions';
import { useBoundStore } from '@stores/useBoundStore';
import { getResponseRequests } from '@utils/apis/my';
import {
  StyledPromptsOfTheDay,
  StyledPromptsOfTheDayContainer,
  StyledRecentPromptsOfTheDay,
} from './PromptsOfTheDay.styled';

function PromptsOfTheDay() {
  const [t] = useTranslation('translation', { keyPrefix: 'prompts' });
  const { todaysQuestions, fetchTodaysQuestions } = useBoundStore(TodayQuestionsSelector);
  const [responseRequests, setResponseRequests] = useState<ResponseRequest[]>([]);

  const fetchReceivedPrompts = async (page: string | null) => {
    const { results } = await getResponseRequests(page);
    if (!results) return;
    setResponseRequests(results);
  };

  const ref = useRef<HTMLDivElement>() as MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);

  useAsyncEffect(async () => {
    await fetchTodaysQuestions();
    await fetchReceivedPrompts(null);
  }, []);

  if (!todaysQuestions) return null;

  return (
    <Layout.FlexCol w="100%">
      <Layout.FlexRow ml={16}>
        <Typo type="title-medium">{t('questions_from_your_friends')}</Typo>
      </Layout.FlexRow>
      <StyledPromptsOfTheDayContainer w="100%" {...events} ref={ref}>
        <StyledPromptsOfTheDay gap={16} mt={10} pl={16} pb={16}>
          {/* received prompts */}
          {responseRequests.map((request) => (
            <PromptCard key={request.id} id={request.id} content={request.question_content} />
          ))}
        </StyledPromptsOfTheDay>
      </StyledPromptsOfTheDayContainer>
      <Layout.FlexRow ml={16}>
        <Typo type="title-medium">{t('todays_questions')}</Typo>
      </Layout.FlexRow>
      <StyledRecentPromptsOfTheDay gap={16} w="100%" alignItems="center">
        {/* today's prompts */}
        {todaysQuestions.map((question) => (
          <RecentPromptCard question={question} key={question.id} />
        ))}
        {todaysQuestions.length === 0 && (
          <NoContents text={t('no_contents.todays_questions')} mv={10} />
        )}
      </StyledRecentPromptsOfTheDay>
    </Layout.FlexCol>
  );
}

export default PromptsOfTheDay;
