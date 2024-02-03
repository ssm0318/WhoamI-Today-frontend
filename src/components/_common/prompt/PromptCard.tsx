import Icon from '@components/header/icon/Icon';
import { Typo } from '@design-system';
import { DailyQuestion } from '@models/post';
import { FlexRow } from 'src/design-system/layouts';
import ProfileImage from '../profile-image/ProfileImage';
import { StyledPromptCard, StyledPromptCardButtons } from './PromptCard.styled';

interface PromptCardProps {
  question: DailyQuestion;
}
function PromptCard({ question }: PromptCardProps) {
  const { content, is_admin_question, author } = question;
  const handleClickRespond = () => {
    // TODO
  };

  const handleClickSend = () => {
    // TODO
  };
  return (
    <StyledPromptCard>
      <FlexRow gap={8} alignItems="center">
        <ProfileImage
          imageUrl={is_admin_question ? '/whoami-profile.svg' : null}
          username={author ?? 'Whoami Today'}
          size={28}
        />
        <Typo type="title-medium">Whoami Today</Typo>
      </FlexRow>
      <Typo type="body-large">{content}</Typo>
      <StyledPromptCardButtons gap={18}>
        <Icon name="question_respond" size={22} onClick={handleClickRespond} />
        <Icon name="question_send" size={22} onClick={handleClickSend} />
      </StyledPromptCardButtons>
    </StyledPromptCard>
  );
}

export default PromptCard;
