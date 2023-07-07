import LikeButton from '@components/_common/like-button/LikeButton';
import { Layout, SvgIcon } from '@design-system';
import { MomentPost, QuestionResponse } from '@models/post';
import * as S from './ReactionButtons.styled';

interface ReactionButtonsProps {
  postType: 'Moment' | 'Response';
  post: MomentPost | QuestionResponse;
  isAuthor?: boolean;
  onClickComments?: () => void;
}

function ReactionButtons({ postType, post, isAuthor, onClickComments }: ReactionButtonsProps) {
  return (
    <Layout.FlexRow alignItems="center">
      <LikeButton postType={postType} post={post} isAuthor={isAuthor} iconSize={18} />
      <S.IconButton type="button" onClick={onClickComments}>
        <SvgIcon name="comment" size={18} />
      </S.IconButton>
    </Layout.FlexRow>
  );
}

export default ReactionButtons;
