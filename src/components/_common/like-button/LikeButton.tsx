import { useState } from 'react';
import { Layout, SvgIcon } from '@design-system';
import { Comment, MomentPost, QuestionResponse, Response } from '@models/post';
import { deleteLike, postLike } from '@utils/apis/likes';
import * as S from './LikeButton.styled';

interface LikeButtonProps {
  postType: 'Moment' | 'Response' | 'Comment';
  post: MomentPost | QuestionResponse | Response | Comment;
  m?: number;
  iconSize: number;
}

function LikeButton({ postType, post, iconSize, m = 6 }: LikeButtonProps) {
  const { id, current_user_like_id } = post;

  const [likeId, setLikeId] = useState<number | null>(current_user_like_id);

  const like = () => {
    postLike({ target_id: id, target_type: postType }).then(({ id: like_id }) => {
      setLikeId(like_id);
    });
  };

  const unLike = () => {
    if (!likeId) return;
    deleteLike(likeId).then(() => {
      setLikeId(null);
    });
  };

  const toggleLike = () => {
    if (likeId) unLike();
    else like();
  };

  return (
    <Layout.FlexRow alignItems="center">
      <S.IconButton type="button" m={m} onClick={toggleLike}>
        <SvgIcon name="heart" size={iconSize} fill={likeId ? 'PRIMARY' : null} />
      </S.IconButton>
    </Layout.FlexRow>
  );
}

export default LikeButton;
