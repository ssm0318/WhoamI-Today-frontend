import { Font, Layout, SvgIcon } from '@design-system';

// TODO 나중에 postType의 question 타입으로 수정
interface QuestionItemProps {
  title: string;
  id: number;
}

function QuestionItem({ title, id }: QuestionItemProps) {
  const handleSend = () => {
    // TODO(handle send)
    console.log(id);
  };

  const handleResponse = () => {
    // TODO(handle response)
    console.log(id);
  };

  return (
    <Layout.FlexRow
      p={16}
      bgColor="GRAY_6"
      rounded={12}
      justifyContent="space-between"
      alignItems="center"
      w="100%"
    >
      <Font.Body type="18_regular">{title}</Font.Body>
      <Layout.FlexRow gap={4}>
        <button type="button" onClick={handleResponse}>
          <SvgIcon name="moment_description_normal" size={36} />
        </button>
        <button type="button" onClick={handleSend}>
          <SvgIcon name="question_send" size={36} />
        </button>
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default QuestionItem;
