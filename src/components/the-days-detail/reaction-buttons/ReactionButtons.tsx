import { Layout, SvgIcon } from '@design-system';
import * as S from './ReactionButtons.styled';

interface ReactionButtonsProps {
  onClickLike?: () => void;
  onClickComments?: () => void;
}

function ReactionButtons({ onClickLike, onClickComments }: ReactionButtonsProps) {
  return (
    <Layout.FlexRow>
      <S.Button onClick={onClickLike}>
        <SvgIcon name="heart" size={24} />
      </S.Button>
      <S.Button onClick={onClickComments}>
        <SvgIcon name="comment" size={24} />
      </S.Button>
    </Layout.FlexRow>
  );
}

export default ReactionButtons;
