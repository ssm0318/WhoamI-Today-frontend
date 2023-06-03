import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Font, Layout, SvgIcon } from '@design-system';
import { Question } from '@models/post';

interface QuestionItemProps {
  question: Question;
  onSend?: () => void;
  disableClickQuestion?: boolean;
}

function QuestionItem({ question, onSend, disableClickQuestion = false }: QuestionItemProps) {
  const { content } = question;
  const navigate = useNavigate();

  const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onSend?.();
  };

  const handleClickQuestion = () => {
    if (disableClickQuestion) return;
    navigate(`/response-history/${question.id}`);
  };

  return (
    <Layout.FlexCol
      pt={22}
      pb={20}
      ph={20}
      rounded={14.5}
      bgColor="GRAY_7"
      w="100%"
      alignItems="center"
      onClick={handleClickQuestion}
    >
      <Font.Body type="20_regular" color="GRAY_6" textAlign="center">
        {content}
      </Font.Body>
      <Layout.FlexRow w="100%" alignItems="center" justifyContent="flex-end" mt={5}>
        <button type="button" onClick={handleSend}>
          <SvgIcon name="question_send" size={36} />
        </button>
      </Layout.FlexRow>
    </Layout.FlexCol>
  );
}

export default QuestionItem;
