import RecentPromptCard from '@components/_common/prompt/RecentPromptCard';
import { Layout, Typo } from '@design-system';
import { ResponseRequest } from '@models/api/question';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface ReceivedPromptListProps {
  title: string;
  responseRequests: ResponseRequest[];
  currDate: Date;
}

export default function ReceivedPromptList({
  title,
  responseRequests,
  currDate,
}: ReceivedPromptListProps) {
  if (!responseRequests.length) return null;
  return (
    <Layout.FlexCol w="100%">
      <Layout.FlexCol w="100%" pv={8}>
        <Layout.FlexRow w="100%" pv={10}>
          <Typo type="title-medium" color="DARK">
            {title}
          </Typo>
        </Layout.FlexRow>
        <Layout.FlexCol w="100%" gap={12}>
          {responseRequests.map((n) => (
            <ReceivedPromptItem responseRequest={n} currDate={currDate} />
          ))}
        </Layout.FlexCol>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

interface ReceivedPromptItemProps {
  responseRequest: ResponseRequest;
  currDate: Date;
}

function ReceivedPromptItem({ responseRequest, currDate }: ReceivedPromptItemProps) {
  const { id, created_at, question_id, requester_username, question_content } = responseRequest;
  return (
    <Layout.FlexRow w="100%" key={id} gap={4} alignItems="center">
      <RecentPromptCard
        requesterName={requester_username}
        question={{
          id: question_id,
          content: question_content,
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
