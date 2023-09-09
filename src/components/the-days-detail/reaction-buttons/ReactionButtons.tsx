import LikeButton from '@components/_common/like-button/LikeButton';
import { Layout, SvgIcon } from '@design-system';
import { MomentPost, QuestionResponse } from '@models/post';
import * as S from './ReactionButtons.styled';

interface ReactionButtonsProps {
  postType: 'Moment' | 'Response';
  post: MomentPost | QuestionResponse;
  onClickComments?: () => void;
}

function ReactionButtons({ postType, post, onClickComments }: ReactionButtonsProps) {
  return (
    <Layout.FlexRow alignItems="center" gap={16}>
      <LikeButton postType={postType} post={post} iconSize={24} />
      <S.IconButton type="button" onClick={onClickComments}>
        <SvgIcon name="comment" size={36} />
      </S.IconButton>
    </Layout.FlexRow>
  );
}

export default ReactionButtons;
