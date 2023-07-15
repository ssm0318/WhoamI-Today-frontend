import { format } from 'date-fns';
import { useState } from 'react';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import CommentList from '@components/comment-list/CommentList';
import { Font, Layout } from '@design-system';
import { DayQuestion, QuestionResponse } from '@models/post';
import { deleteResponse } from '@utils/apis/responses';
import DeleteAlert from '../../_common/alert-dialog/delete-alert/DeleteAlert';
import ReactionButtons from '../reaction-buttons/ReactionButtons';
import { ContentWrapper } from '../the-days-moments/TheDaysMoments.styled';
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

interface ResponseItemProps {
  response: QuestionResponse;
  useDeleteButton?: boolean;
  onClickDeleteBtn?: (responseId: number) => void;
}

function ResponseItem({ response, useDeleteButton, onClickDeleteBtn }: ResponseItemProps) {
  const [showComments, setShowComments] = useState(false);

  const handleDeleteBtn = (responseId: number) => () => {
    onClickDeleteBtn?.(responseId);
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <S.Response>
      <ContentWrapper>
        <Font.Body type="18_regular">{response.content}</Font.Body>
        {useDeleteButton && <DeleteButton onClick={handleDeleteBtn(response.id)} />}
      </ContentWrapper>
      <S.ResponseFooter>
        <Font.Body type="12_regular" color="GRAY_12">
          {format(new Date(response.created_at), 'HH:mm')}
        </Font.Body>
        <ReactionButtons
          postType="Response"
          post={response}
          isAuthor={useDeleteButton} // FIXME: 사용자 작성글인지 구분
          onClickComments={toggleComments}
        />
      </S.ResponseFooter>
      {showComments && <CommentList postType="Response" post={response} />}
    </S.Response>
  );
}
