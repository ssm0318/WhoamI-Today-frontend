import { useState } from 'react';
import { Font, Layout, SvgIcon } from '@design-system';
import { GetMomentResponse } from '@models/api/moment';
import { QuestionResponse } from '@models/post';

interface LikeButtonProps {
  postType: 'Moment' | 'Response';
  post: GetMomentResponse | QuestionResponse;
  isAuthor?: boolean;
  btnClassName?: string;
}

function LikeButton({ postType, post, isAuthor, btnClassName = '' }: LikeButtonProps) {
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
    <Layout.FlexRow w="100%" alignItems="center">
      {isAuthor && <Font.Body type="12_regular">{likeCount ?? 0}</Font.Body>}
      <button type="button" className={btnClassName} onClick={toggleLike}>
        <SvgIcon name="heart" size={18} fill={liked ? 'BASIC_BLACK' : null} />
      </button>
    </Layout.FlexRow>
  );
}

export default LikeButton;
