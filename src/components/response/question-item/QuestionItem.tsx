import { Font, Layout, SvgIcon } from '@design-system';

interface QuestionItemProps {
  question: string;
}

function QuestionItem({ question }: QuestionItemProps) {
  return (
    <Layout.FlexCol
      pt={22}
      pb={20}
      ph={20}
      rounded={14.5}
      bgColor="GRAY_7"
      w="100%"
      alignItems="center"
    >
      <Font.Body type="20_regular" color="GRAY_6" textAlign="center">
        {question}
      </Font.Body>
      <Layout.FlexRow w="100%" alignItems="center" justifyContent="flex-end" mt={5}>
        <SvgIcon name="question_send" size={36} />
      </Layout.FlexRow>
    </Layout.FlexCol>
  );
}

export default QuestionItem;
