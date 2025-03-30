import { MouseEvent, useEffect, useState } from 'react';
import { Layout, SvgIcon } from '@design-system';
import {
  Comment,
  MomentPost,
  Note,
  PrivateComment,
  QuestionResponse,
  Response,
} from '@models/post';
import { deleteLike, postLike } from '@utils/apis/likes';
import * as S from './LikeButton.styled';

interface LikeButtonProps {
  postType: 'Moment' | 'Response' | 'Comment' | 'Note' | 'PrivateComment';
  post: MomentPost | QuestionResponse | Response | Comment | Note | PrivateComment;
  m?: number;
  iconSize: number;
  refresh?: () => void;
}

function LikeButton({ postType, post, iconSize, m = 6, refresh }: LikeButtonProps) {
  const { id, current_user_like_id } = post;

  const [likeId, setLikeId] = useState<number | null>(current_user_like_id);

  useEffect(() => {
    setLikeId(current_user_like_id);
  }, [current_user_like_id]);

  const like = () => {
    if (!id) return;
    postLike({ target_id: id, target_type: postType }).then(({ id: like_id }) => {
      setLikeId(like_id);
      refresh?.();
    });
  };

  const unLike = () => {
    if (!likeId) return;
    deleteLike(likeId).then(() => {
      setLikeId(null);
      refresh?.();
    });
  };

  const toggleLike = (e: MouseEvent) => {
    e.stopPropagation();
    if (likeId) unLike();
    else like();
  };

  return (
    <Layout.FlexRow alignItems="center">
      {id && (
        <S.IconButton type="button" m={m} onClick={toggleLike} size={iconSize}>
          <SvgIcon name={likeId ? 'like_filled' : 'like'} size={iconSize} />
        </S.IconButton>
      )}
    </Layout.FlexRow>
  );
}

export default LikeButton;
