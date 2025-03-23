import RecentPromptCard from '@components/_common/prompt/RecentPromptCard';
import { Layout, Typo } from '@design-system';
import { ResponseRequest } from '@models/api/question';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import * as S from './ReceivedPromptItem.styled';

interface ReceivedPromptItemProps {
  responseRequest: ResponseRequest;
  currDate?: Date;
  showDate?: boolean;
}

function ReceivedPromptItem({
  responseRequest,
  currDate = new Date(),
  showDate = true,
}: ReceivedPromptItemProps) {
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
      {showDate && (
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
      )}
    </Layout.FlexRow>
  );
}

export default ReceivedPromptItem;
