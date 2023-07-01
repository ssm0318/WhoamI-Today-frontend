import { format } from 'date-fns';
import { useState } from 'react';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import { Font, Layout } from '@design-system';
import { DayQuestion } from '@models/post';
import DeleteAlert from '../delete-alert/DeleteAlert';
import ReactionButtons from '../reaction-buttons/ReactionButtons';
import { ContentWrapper } from '../the-days-moments/TheDaysMoments.styled';
import TheDaysWrapper from '../the-days-wrapper/TheDaysWrapper';
import * as S from './TheDaysQuestions.styled';

interface TheDaysQuestionsProps {
  questions: DayQuestion[];
  useDeleteButton?: boolean;
}

function TheDaysQuestions({ questions, useDeleteButton }: TheDaysQuestionsProps) {
  const [deleteTarget, setDeleteTarget] = useState<number>();

  const closeDeleteAlert = () => {
    setDeleteTarget(undefined);
  };

  const onClickResponseDelete = (responseId: number) => () => {
    setDeleteTarget(responseId);
  };

  const deleteResponse = () => {
    console.log(`TODO: delete response ${deleteTarget}`);
    closeDeleteAlert();
  };

  return (
    <TheDaysWrapper type="questions">
      {questions.map(
        (question) => (
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
                <S.Response key={response.id}>
                  <ContentWrapper>
                    <Font.Body type="18_regular">{response.content}</Font.Body>
                    {useDeleteButton && (
                      <DeleteButton onClick={onClickResponseDelete(response.id)} />
                    )}
                  </ContentWrapper>
                  <S.ResponseFooter>
                    <Font.Body type="12_regular" color="GRAY_12">
                      {format(new Date(response.created_at), 'HH:mm')}
                    </Font.Body>
                    <ReactionButtons
                      postType="Response"
                      post={response}
                      isAuthor={useDeleteButton} // FIXME: 사용자 작성글인지 구분
                    />
                  </S.ResponseFooter>
                </S.Response>
              ))}
            </S.ResponseList>
          </S.QuestionWrapper>
        ),
        [],
      )}
      <DeleteAlert
        visible={!!deleteTarget}
        close={closeDeleteAlert}
        onClickConfirm={deleteResponse}
      />
    </TheDaysWrapper>
  );
}

export default TheDaysQuestions;
