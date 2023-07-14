import { useState } from 'react';
import { Font, Layout, SvgIcon } from '@design-system';
import { Comment, MomentPost, QuestionResponse, Response } from '@models/post';
import { deleteLike, postLike } from '@utils/apis/likes';
import * as S from './LikeButton.styled';

interface LikeButtonProps {
  postType: 'Moment' | 'Response' | 'Comment';
  post: MomentPost | QuestionResponse | Response | Comment;
  isAuthor?: boolean;
  m?: number;
  iconSize: number;
}

function LikeButton({ postType, post, isAuthor, iconSize, m = 6 }: LikeButtonProps) {
  const { id, current_user_liked, like_count } = post;

  const [liked, setLiked] = useState(current_user_liked);
  const [likeCount, setLikeCount] = useState(like_count ?? 0);

  const like = () => {
    postLike({ target_id: id, target_type: postType }).then(() => {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    });
  };

  const unLike = () => {
    deleteLike({ target_id: id, target_type: postType }).then(() => {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    });
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
