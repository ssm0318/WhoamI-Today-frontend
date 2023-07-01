import { useState } from 'react';
import { Font, Layout, SvgIcon } from '@design-system';
import { GetMomentResponse } from '@models/api/moment';
import { Comment, QuestionResponse } from '@models/post';
import * as S from './LikeButton.styled';

interface LikeButtonProps {
  postType: 'Moment' | 'Response' | 'Comment';
  post: GetMomentResponse | QuestionResponse | Comment;
  isAuthor?: boolean;
  m?: number;
  iconSize: number;
}

function LikeButton({ postType, post, isAuthor, iconSize, m = 6 }: LikeButtonProps) {
  const { id, current_user_liked, like_count } = post;

  const [liked, setLiked] = useState(current_user_liked);
  const [likeCount, setLikeCount] = useState(like_count ?? 0);

  const like = () => {
    console.log(`TODO: like ${postType} ${id}`);
    setLiked(true);
    setLikeCount((prev) => prev + 1);
  };

  const unLike = () => {
    console.log(`TODO: unlike ${postType} ${id}`);
    setLiked(false);
    setLikeCount((prev) => prev - 1);
  };

  const toggleLike = () => {
    if (liked) unLike();
    else like();
  };

  return (
    <Layout.FlexRow alignItems="center">
      {isAuthor && <Font.Body type="12_regular">{likeCount ?? 0}</Font.Body>}
      <S.IconButton type="button" m={m} onClick={toggleLike}>
        <SvgIcon name="heart" size={iconSize} fill={liked ? 'BASIC_BLACK' : null} />
      </S.IconButton>
    </Layout.FlexRow>
  );
}

export default LikeButton;
