import { useState } from 'react';
import { ResponseItem } from '@components/the-days-detail/the-days-questions/ResponseItem';
import { Font, Layout } from '@design-system';
import { DayQuestion } from '@models/post';
import { deleteResponse } from '@utils/apis/responses';
import DeleteAlert from '../../_common/alert-dialog/delete-alert/DeleteAlert';
import TheDaysWrapper from '../the-days-wrapper/TheDaysWrapper';
import * as S from './TheDaysQuestions.styled';

interface TheDaysQuestionsProps {
  questions: DayQuestion[];
  useDeleteButton?: boolean;
  reloadQuestions?: () => void;
}

export default function TheDaysQuestions({
  questions,
  useDeleteButton,
  reloadQuestions,
}: TheDaysQuestionsProps) {
  const [deleteTarget, setDeleteTarget] = useState<number>();

  const closeDeleteAlert = () => {
    setDeleteTarget(undefined);
  };

  const onClickResponseDelete = (responseId: number) => {
    setDeleteTarget(responseId);
  };

  const confirmDeleteAlert = () => {
    if (!deleteTarget) {
      closeDeleteAlert();
      return;
    }

    deleteResponse(deleteTarget)
      .then(() => {
        reloadQuestions?.();
      })
      .catch(() => console.log('TODO: 삭제 실패 알림'))
      .finally(() => closeDeleteAlert());
  };

  return (
    <TheDaysWrapper type="questions">
      {questions.map((question) => (
        <S.QuestionWrapper key={question.id}>
          <Layout.FlexCol w="100%" pl={12} pr={12}>
            <S.Question>
              <Font.Display type="18_bold" color="GRAY_3">
                {question.content}
              </Font.Display>
            </S.Question>
          </Layout.FlexCol>
          <S.ResponseList>
            {question.responses.map((response) => (
              <ResponseItem
                key={response.id}
                response={response}
                useDeleteButton={useDeleteButton}
                onClickDeleteBtn={onClickResponseDelete}
              />
            ))}
          </S.ResponseList>
        </S.QuestionWrapper>
      ))}
      <DeleteAlert
        visible={!!deleteTarget}
        close={closeDeleteAlert}
        onClickConfirm={confirmDeleteAlert}
      />
    </TheDaysWrapper>
  );
}
