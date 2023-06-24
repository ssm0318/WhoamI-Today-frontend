import { useState } from 'react';
import { Font, Layout, SvgIcon } from '@design-system';
import { GetMomentResponse } from '@models/api/moment';
import { Response } from '@models/post';
import * as S from './ReactionButtons.styled';

interface ReactionButtonsProps {
  postType: 'Moment' | 'Response';
  post: Response | GetMomentResponse;
  isAuthor?: boolean;
  onClickComments?: () => void;
}

function ReactionButtons({ postType, post, isAuthor, onClickComments }: ReactionButtonsProps) {
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

  /* TODO: 댓글창 버튼 토글 */

  return (
    <Layout.FlexRow alignItems="center">
      {isAuthor && <Font.Body type="12_regular">{likeCount ?? 0}</Font.Body>}
      <S.Button onClick={toggleLike}>
        <SvgIcon name="heart" size={18} fill={liked ? 'BASIC_BLACK' : null} />
      </S.Button>
      <S.Button onClick={onClickComments}>
        <SvgIcon name="comment" size={18} />
      </S.Button>
    </Layout.FlexRow>
  );
}

export default ReactionButtons;
