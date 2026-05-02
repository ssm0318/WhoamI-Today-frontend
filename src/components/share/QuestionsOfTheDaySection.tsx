import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';
import Icon from '@components/_common/icon/Icon';
import PromptCard from '@components/_common/prompt/PromptCard';
import { Layout, Typo } from '@design-system';
import { DailyQuestion } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getTodayQuestions } from '@utils/apis/question';

const MAX_VISIBLE_QUESTIONS = 1;

function QuestionsOfTheDaySection() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();
  const { featureFlags } = useBoundStore(UserSelector);

  const { data: todayQuestions } = useSWR<DailyQuestion[]>(
    '/qna/questions/daily/',
    getTodayQuestions,
  );

  const visibleQuestions = todayQuestions?.slice(0, MAX_VISIBLE_QUESTIONS) ?? [];

  const title = featureFlags?.postsVerQ
    ? t('share_page.qna_title')
    : t('share_page.questions_of_the_day');

  return (
    <Card>
      <Typo type="head-line" bold mb={24}>
        {title}
      </Typo>
      {visibleQuestions.length > 0 ? (
        <Layout.FlexCol w="100%" gap={10}>
          {visibleQuestions.map((question) => (
            <PromptCard
              key={question.id}
              id={question.id}
              content={question.content}
              date={
                question.selected_dates?.[question.selected_dates.length - 1] ?? question.created_at
              }
              widthMode="full"
            />
          ))}
        </Layout.FlexCol>
      ) : (
        <Typo type="body-medium" color="MEDIUM_GRAY">
          {t('no_contents.question')}
        </Typo>
      )}
      {todayQuestions && todayQuestions.length > 0 && (
        <Layout.FlexRow
          w="100%"
          justifyContent="center"
          alignItems="center"
          gap={4}
          mt={16}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/questions')}
        >
          <Typo type="title-medium" fontWeight={600}>
            See all questions
          </Typo>
          <Icon name="chevron_right" size={14} color="BLACK" />
        </Layout.FlexRow>
      )}
    </Card>
  );
}

const Card = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.SECONDARY};
`;

export default QuestionsOfTheDaySection;
