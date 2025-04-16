import { MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, SvgIcon } from '@design-system';
import {
  Comment,
  MomentPost,
  Note,
  PrivateComment,
  QuestionResponse,
  Response,
} from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
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
  const [t] = useTranslation('translation');
  const { openToast } = useBoundStore((state) => ({
    openToast: state.openToast,
  }));

  const [likeId, setLikeId] = useState<number | null>(current_user_like_id);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setLikeId(current_user_like_id);
  }, [current_user_like_id]);

  const like = async () => {
    if (!id || isLoading) return;

    try {
      setIsLoading(true);
      const { id: like_id } = await postLike({ target_id: id, target_type: postType });
      setLikeId(like_id);
      refresh?.();
    } catch (error) {
      openToast({
        message: t('error.like_duplicate'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unLike = async () => {
    if (!likeId || isLoading) return;

    try {
      setIsLoading(true);
      await deleteLike(likeId);
      setLikeId(null);
      refresh?.();
    } catch (error) {
      openToast({
        message: t('error.unlike_duplicate'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = (e: MouseEvent) => {
    e.stopPropagation();
    if (likeId) unLike();
    else like();
  };

  return (
    <Layout.FlexRow alignItems="center">
      {id && (
        <S.IconButton type="button" m={m} onClick={toggleLike} size={iconSize} disabled={isLoading}>
          <SvgIcon name={likeId ? 'like_filled' : 'like'} size={iconSize} />
        </S.IconButton>
      )}
    </Layout.FlexRow>
  );
}

export default LikeButton;
