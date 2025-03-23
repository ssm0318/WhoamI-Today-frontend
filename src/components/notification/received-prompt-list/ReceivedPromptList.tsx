import ReceivedPromptItem from '@components/prompt/received-prompt-item/ReceivedPromptItem';
import { Layout, Typo } from '@design-system';
import { ResponseRequest } from '@models/api/question';

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
            <ReceivedPromptItem key={n.id} responseRequest={n} currDate={currDate} />
          ))}
        </Layout.FlexCol>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}
