import { MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, SvgIcon } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { deleteLike, postLike } from '@utils/apis/likes';
import * as S from './LikeButton.styled';

interface LikeButtonProps {
  postType: 'Moment' | 'Response' | 'Comment' | 'Note' | 'PrivateComment';
  postId: number;
  currentUserLikeId: number | null;
  m?: number;
  iconSize: number;
  outerSize?: number;
  refresh?: () => void;
}

function LikeButton({
  postType,
  postId,
  currentUserLikeId,
  iconSize,
  m = 6,
  outerSize = 48,
  refresh,
}: LikeButtonProps) {
  const [t] = useTranslation('translation');
  const { openToast } = useBoundStore((state) => ({
    openToast: state.openToast,
  }));

  const [likeId, setLikeId] = useState<number | null>(currentUserLikeId);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setLikeId(currentUserLikeId);
  }, [currentUserLikeId]);

  const like = async () => {
    if (!postId || isLoading) return;

    try {
      setIsLoading(true);
      const { id: like_id } = await postLike(
        { target_id: postId, target_type: postType },
        (errorMsg) => {
          openToast({
            message: errorMsg || t('error.like_duplicate'),
          });
        },
      );
      setLikeId(like_id);
      refresh?.();
    } catch (error) {
      // Error already handled by onError callback
    } finally {
      setIsLoading(false);
    }
  };

  const unLike = async () => {
    if (!likeId || isLoading) return;

    try {
      setIsLoading(true);
      await deleteLike(likeId, (errorMsg) => {
        openToast({
          message: errorMsg || t('error.unlike_duplicate'),
        });
      });
      setLikeId(null);
      refresh?.();
    } catch (error) {
      // Error already handled by onError callback
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
    <Layout.FlexRow alignItems="center" w={outerSize} h={outerSize} justifyContent="center">
      {postId && (
        <S.IconButton type="button" m={m} onClick={toggleLike} size={iconSize} disabled={isLoading}>
          <SvgIcon name={likeId ? 'like_filled' : 'like'} size={iconSize} />
        </S.IconButton>
      )}
    </Layout.FlexRow>
  );
}

export default LikeButton;
