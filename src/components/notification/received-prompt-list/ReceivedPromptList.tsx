import RecentPromptCard from '@components/_common/prompt/RecentPromptCard';
import { Layout, Typo } from '@design-system';
import { ResponseRequest } from '@models/api/question';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import * as S from './ReceivedPromptList.styled';

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

interface ReceivedPromptItemProps {
  responseRequest: ResponseRequest;
  currDate: Date;
}

function ReceivedPromptItem({ responseRequest, currDate }: ReceivedPromptItemProps) {
  const { id, created_at, question_id, requester_username, question_content } = responseRequest;
  return (
    <Layout.FlexRow w="100%" key={id} gap={13} alignItems="center">
      <RecentPromptCard
        requesterName={requester_username}
        question={{
          id: question_id,
          content: question_content,
        }}
      />
      <S.CreatedAtContainer w={30}>
        <Typo type="label-small" color="MEDIUM_GRAY">
          {convertTimeDiffByString({
            now: currDate,
            day: new Date(created_at),
            isShortFormat: true,
            useSoonText: false,
          })}
        </Typo>
      </S.CreatedAtContainer>
    </Layout.FlexRow>
  );
}
