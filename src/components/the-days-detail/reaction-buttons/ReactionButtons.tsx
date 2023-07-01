import LikeButton from '@components/_common/like-button/LikeButton';
import { SvgIcon } from '@design-system';
import { GetMomentResponse } from '@models/api/moment';
import { QuestionResponse } from '@models/post';
import * as S from './ReactionButtons.styled';

interface ReactionButtonsProps {
  postType: 'Moment' | 'Response';
  post: GetMomentResponse | QuestionResponse;
  isAuthor?: boolean;
  onClickComments?: () => void;
}

function ReactionButtons({ postType, post, isAuthor, onClickComments }: ReactionButtonsProps) {
  return (
    <S.ReactionButtonsWrapper>
      <LikeButton btnClassName="reaction_btn" postType={postType} post={post} isAuthor={isAuthor} />
      <button type="button" className="reaction_btn" onClick={onClickComments}>
        <SvgIcon name="comment" size={18} />
      </button>
    </S.ReactionButtonsWrapper>
  );
}

export default ReactionButtons;
