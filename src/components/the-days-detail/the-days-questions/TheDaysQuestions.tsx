import { format } from 'date-fns';
import { useMemo } from 'react';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import { Font, Layout } from '@design-system';
import { Response } from '@models/post';
import ReactionButtons from '../reaction-buttons/ReactionButtons';
import { ContentWrapper } from '../the-days-moments/TheDaysMoments.styled';
import TheDaysWrapper from '../the-days-wrapper/TheDaysWrapper';
import { getDaysQuestionList } from './TheDaysQuestions.helper';
import * as S from './TheDaysQuestions.styled';

interface TheDaysMomentsProps {
  responses: Response[];
  useDeleteButton?: boolean;
}

function TheDaysQuestions({ responses, useDeleteButton }: TheDaysMomentsProps) {
  const onClickResponseDelete = () => {
    console.log('click response delete button');
  };

  const daysQuestionList = useMemo(() => getDaysQuestionList(responses), [responses]);

  return (
    <TheDaysWrapper type="questions">
      {daysQuestionList.map(
        ({ question, responseList }) => (
          <S.QuestionWrapper key={question.id}>
            <Layout.FlexCol w="100%" pl={12} pr={12}>
              <S.Question>
                <Font.Display type="18_bold" color="GRAY_3">
                  {question.content}
                </Font.Display>
              </S.Question>
            </Layout.FlexCol>
            <S.ResponseList>
              {responseList.map(({ id, content: responseContent, created_at }) => (
                <S.Response key={id}>
                  <ContentWrapper>
                    <Font.Body type="18_regular">{responseContent}</Font.Body>
                    {useDeleteButton && <DeleteButton onClick={onClickResponseDelete} />}
                  </ContentWrapper>
                  <S.ResponseFooter>
                    <Font.Body type="12_regular" color="GRAY_12">
                      {format(new Date(created_at), 'HH:mm')}
                    </Font.Body>
                    {/* TODO: 좋아요, 댓글창 버튼 기능 추가 */}
                    <ReactionButtons />
                  </S.ResponseFooter>
                </S.Response>
              ))}
            </S.ResponseList>
          </S.QuestionWrapper>
        ),
        [],
      )}
    </TheDaysWrapper>
  );
}

export default TheDaysQuestions;
