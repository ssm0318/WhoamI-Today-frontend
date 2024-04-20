import Icon from '@components/_common/icon/Icon';
import { Typo } from '@design-system';
import { DailyQuestion, Question } from '@models/post';
import { FlexCol, FlexRow } from 'src/design-system/layouts';
import ProfileImage from '../profile-image/ProfileImage';
import { StyledRecentPromptCard, StyledRecentPromptCardButtons } from './RecentPromptCard.styled';

interface PromptCardProps {
  question: Question | DailyQuestion;
}
function RecentPromptCard({ question }: PromptCardProps) {
  const { content } = question;
  const handleClickRespond = () => {
    // TODO
  };

  const handleClickSend = () => {
    // TODO
  };
  return (
    <StyledRecentPromptCard>
      <FlexCol gap={8}>
        <FlexRow gap={8} alignItems="center">
          <ProfileImage imageUrl="/whoami-profile.svg" username="Whoami Today" size={28} />
          <Typo type="title-medium">Whoami Today</Typo>
        </FlexRow>
        <Typo type="body-large">{content}</Typo>
      </FlexCol>
      <StyledRecentPromptCardButtons gap={18}>
        <Icon name="question_send" size={22} onClick={handleClickSend} />
        <Icon name="question_respond" size={22} onClick={handleClickRespond} />
      </StyledRecentPromptCardButtons>
    </StyledRecentPromptCard>
  );
}

export default RecentPromptCard;
