import { Loader } from '@components/_common/loader/Loader.styled';
import { Layout } from '@design-system';
import { DayQuestion } from '@models/post';
import TheDaysQuestions from './the-days-questions/TheDaysQuestions';

interface TheDaysDetailProps {
  mt?: number;
  isLoading?: boolean;
  questions?: DayQuestion[];
  useDeleteButton?: boolean;
  reloadQuestions?: () => void;
}

function TheDaysDetail({
  mt,
  isLoading = false,
  questions,
  useDeleteButton,
  reloadQuestions,
}: TheDaysDetailProps) {
  const hasQuestions = questions && questions.length > 0;

  if (isLoading) return <Loader />;
  return (
    <Layout.FlexCol w="100%" mt={mt}>
      {hasQuestions && (
        <TheDaysQuestions
          questions={questions}
          useDeleteButton={useDeleteButton}
          reloadQuestions={reloadQuestions}
        />
      )}
    </Layout.FlexCol>
  );
}

export default TheDaysDetail;
