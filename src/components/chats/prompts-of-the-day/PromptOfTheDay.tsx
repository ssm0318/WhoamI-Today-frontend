import { useTranslation } from 'react-i18next';
import Collapse from '@components/_common/\bcollapse/Collapse';
import PromptCard from '@components/_common/prompt/PromptCard';
import { SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { TodayQuestionsSelector } from '@stores/todaysQuestions';
import { useBoundStore } from '@stores/useBoundStore';
import { StyledPromptMoreButton, StyledPromptsOfTheDay } from './PromptsOfTheDay.styled';

function PromptsOfTheDay() {
  const [t] = useTranslation('translation', { keyPrefix: 'chats.prompts_of_the_day' });
  const { todaysQuestions, fetchTodaysQuestions } = useBoundStore(TodayQuestionsSelector);

  useAsyncEffect(async () => {
    await fetchTodaysQuestions();
  }, []);

  if (!todaysQuestions) return null;
  return (
    <Collapse
      title={t('title')}
      collapsedItem={
        <StyledPromptsOfTheDay gap={16} pl={12} pb={26} pr={50} w="100%" alignItems="center">
          {todaysQuestions.map((question) => (
            <PromptCard question={question} />
          ))}
          <StyledPromptMoreButton type="button">
            <Typo type="body-large">{t('more')}</Typo>
            <SvgIcon name="arrow_right" size={32} className="icon" />
          </StyledPromptMoreButton>
        </StyledPromptsOfTheDay>
      }
    />
  );
}

export default PromptsOfTheDay;
