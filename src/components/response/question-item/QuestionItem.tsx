import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import { DailyQuestion } from '@models/post';
import { QuestionItemWrapper } from './QuestionItem.styled';

interface QuestionItemProps {
  question: DailyQuestion;
  onSend?: () => void;
}

function QuestionItem({ question, onSend }: QuestionItemProps) {
  const { content } = question;

  const handleClickRespond = () => {
    // TODO
  };

  const handleClickSend = () => {
    // TODO
    onSend?.();
  };

  return (
    <QuestionItemWrapper p={16} rounded={12} w="100%">
      <Layout.FlexRow gap={8} alignItems="center">
        <ProfileImage imageUrl="/whoami-profile.svg" username="Whoami Today" size={28} />
        <Typo type="title-medium">Prompt of the day</Typo>
      </Layout.FlexRow>
      <Typo type="body-large" mt={14}>
        {content}
      </Typo>
      <Layout.FlexRow w="100%" alignItems="center" justifyContent="flex-end" gap={18} mt={4}>
        <Icon name="question_respond" size={22} onClick={handleClickRespond} />
        <Icon name="question_send" size={22} onClick={handleClickSend} />
      </Layout.FlexRow>
    </QuestionItemWrapper>
  );
}

export default QuestionItem;
