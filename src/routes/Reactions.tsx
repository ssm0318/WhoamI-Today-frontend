import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import Icon from '@components/_common/icon/Icon';
import Loader from '@components/_common/loader/Loader';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PaginationResponse } from '@models/api/common';
import { PostReaction } from '@models/post';
import { getNoteReactions } from '@utils/apis/note';
import { getResponseReactions } from '@utils/apis/responses';
import { MainScrollContainer } from './Root';

function Reactions() {
  const { noteId, responseId } = useParams();
  const navigate = useNavigate();
  const [t] = useTranslation('translation', { keyPrefix: 'reactions' });
  const [reactions, setReactions] = useState<PostReaction[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);

  const handleClickFriend = (username: string) => {
    return navigate(`/users/${username}`);
  };

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchReactions(nextPage ?? null);
  });

  const getReactions = async (page: string | null): Promise<PaginationResponse<PostReaction[]>> => {
    if (noteId) return getNoteReactions(Number(noteId), page);
    if (responseId) return getResponseReactions(Number(responseId), page);
    return { results: [], next: null, previous: null, count: 0 };
  };

  const fetchReactions = async (page: string | null) => {
    const { results, next } = await getReactions(page);
    if (!results) return;
    setNextPage(next);
    setReactions([...reactions, ...results]);
    setIsLoading(false);
  };

  return (
    <MainScrollContainer>
      <SubHeader title={t('title')} />
      <Layout.FlexCol w="100%" ph={16}>
        {reactions.map((reaction) => {
          const { id, user_detail, reaction: emoji } = reaction;
          const { username, profile_image } = user_detail;
          return (
            <Layout.FlexRow
              alignItems="center"
              justifyContent="space-between"
              pv={12}
              pr={8}
              w="100%"
              key={id}
              onClick={() => handleClickFriend(username)}
            >
              <Layout.FlexRow gap={14} alignItems="center">
                <ProfileImage imageUrl={profile_image} username={username} size={44} />
                <Typo type="title-medium">{username}</Typo>
              </Layout.FlexRow>
              <Layout.FlexRow>
                {emoji ? (
                  <EmojiItem emojiString={emoji || ''} size={20} />
                ) : (
                  <Icon name="like_filled" size={24} />
                )}
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
    </MainScrollContainer>
  );
}

export default Reactions;
