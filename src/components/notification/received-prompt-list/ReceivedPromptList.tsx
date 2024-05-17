import RecentPromptCard from '@components/_common/prompt/RecentPromptCard';
import { Layout, Typo } from '@design-system';
import { ResponseRequest } from '@models/api/question';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface ReceivedPromptListProps {
  title: string;
  prompts: ResponseRequest[];
  currDate: Date;
}

export default function ReceivedPromptList({ title, prompts, currDate }: ReceivedPromptListProps) {
  if (!prompts.length) return null;
  return (
    <Layout.FlexCol w="100%">
      <Layout.FlexCol w="100%" pv={8}>
        <Layout.FlexRow w="100%" pv={10}>
          <Typo type="title-medium" color="DARK">
            {title}
          </Typo>
        </Layout.FlexRow>
        <Layout.FlexCol w="100%" gap={12}>
          {prompts.map((n) => (
            <ReceivedPromptItem prompt={n} currDate={currDate} />
          ))}
        </Layout.FlexCol>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

interface ReceivedPromptItemProps {
  prompt: ResponseRequest;
  currDate: Date;
}

function ReceivedPromptItem({ prompt, currDate }: ReceivedPromptItemProps) {
  const { id, created_at, question_id } = prompt;
  return (
    <Layout.FlexRow w="100%" key={id} gap={4} alignItems="center">
      {/* TODO: question 필드가 없어서 임시로 임의로 question을 만들어서 넘겨줌. 나중에 수정 필요! */}
      <RecentPromptCard
        requesterName="User!!"
        question={{
          type: 'Question',
          id: question_id,
          content: 'What was a funny thing that happened today?',
          created_at,
          is_admin_question: false,
          selected_dates: ['2024-05-10'],
          selected: false,
        }}
      />
      <Layout.FlexCol w={21} alignItems="flex-end" gap={2}>
        <Typo type="label-small" color="MEDIUM_GRAY">
          {convertTimeDiffByString({
            now: currDate,
            day: new Date(created_at),
            isShortFormat: true,
            useSoonText: false,
          })}
        </Typo>
      </Layout.FlexCol>
    </Layout.FlexRow>
  );
}
