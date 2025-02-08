import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import Popup from '@components/_common/popup/Popup';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PaginationResponse } from '@models/api/common';
import { Like } from '@models/post';
import { getCommentLikes } from '@utils/apis/comments';

interface LikesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  commentId: number;
  onClickUser: (username: string) => void;
}

function LikesPopup({ isOpen, onClose, commentId, onClickUser }: LikesPopupProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'likes' });
  const [reactions, setReactions] = useState<Like[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchReactions(nextPage ?? null);
  });

  const getReactions = async (page: string | null): Promise<PaginationResponse<Like[]>> => {
    return getCommentLikes(commentId, page);
  };

  const fetchReactions = async (page: string | null) => {
    const { results, next } = await getReactions(page);
    if (!results) return;
    setNextPage(next);
    setReactions([...reactions, ...results]);
    setIsLoading(false);
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <Layout.FlexCol w="100%" h="100%" bgColor="WHITE" rounded={16}>
        <Layout.FlexRow w="100%" h={56} ph={20} alignItems="center" justifyContent="center">
          <Typo type="title-medium">{t('title')}</Typo>
        </Layout.FlexRow>
        <Layout.FlexCol
          w="100%"
          h="calc(100% - 56px)"
          ph={16}
          style={{
            overflowY: 'auto',
          }}
        >
          {reactions.map((reaction) => {
            const { id, user_detail } = reaction;
            const { profile_image, username: userName } = user_detail;
            return (
              <Layout.FlexRow
                alignItems="center"
                justifyContent="space-between"
                pv={12}
                pr={8}
                w="100%"
                key={id}
                onClick={() => onClickUser(userName)}
              >
                <Layout.FlexRow gap={14} alignItems="center">
                  <ProfileImage imageUrl={profile_image} username={userName} size={44} />
                  <Typo type="title-medium">{userName}</Typo>
                </Layout.FlexRow>
              </Layout.FlexRow>
            );
          })}
          <div ref={targetRef} />
          {isLoading && (
            <Layout.FlexRow w="100%" h={40}>
              <Loader />
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
      </Layout.FlexCol>
    </Popup>
  );
}

export default LikesPopup;
