import { format } from 'date-fns';
import { useState } from 'react';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import CommentList from '@components/comment-list/CommentList';
import { Font } from '@design-system';
import { QuestionResponse } from '@models/post';
import { ContentWrapper } from '../_styled/contentWrapper.styled';
import ReactionButtons from '../reaction-buttons/ReactionButtons';
import * as S from './ResponseItem.styled';

interface ResponseItemProps {
  response: QuestionResponse;
  useDeleteButton?: boolean;
  onClickDeleteBtn?: (responseId: number) => void;
}

export function ResponseItem({ response, useDeleteButton, onClickDeleteBtn }: ResponseItemProps) {
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