import RecentPromptCard from '@components/_common/prompt/RecentPromptCard';
import { Layout, Typo } from '@design-system';
import { Notification } from '@models/notification';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface ReceivedPromptListProps {
  title: string;
  prompts: Notification[];
}

export default function ReceivedPromptList({ title, prompts }: ReceivedPromptListProps) {
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
          {/* TODO: question 필드가 없어서 임시로 임의로 question을 만들어서 넘겨줌. 나중에 api 교체시 수정 필요! */}
          {prompts.map((n) => (
            <ReceivedPromptItem prompt={n} />
          ))}
        </Layout.FlexCol>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

interface ReceivedPromptItemProps {
  prompt: Notification;
}

function ReceivedPromptItem({ prompt }: ReceivedPromptItemProps) {
  const { id, question_content, created_at, recent_actors } = prompt;
  return (
    <Layout.FlexRow w="100%" key={id} gap={4} alignItems="center">
      <RecentPromptCard
        sentBy={recent_actors[0]}
        question={{
          type: 'Question',
          id,
          content: question_content,
          created_at,
          is_admin_question: false,
          selected_dates: ['2024-05-10'],
          selected: false,
        }}
      />
      <Layout.FlexCol w={21} alignItems="flex-end" gap={2}>
        <Typo type="label-small" color="MEDIUM_GRAY">
          {convertTimeDiffByString(new Date(), new Date(created_at), 'yyyy.MM.dd HH:mm', true)}
        </Typo>
      </Layout.FlexCol>
    </Layout.FlexRow>
  );
}
