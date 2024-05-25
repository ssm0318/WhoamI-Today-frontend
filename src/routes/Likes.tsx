import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SearchInput from '@components/_common/search-input/SearchInput';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PaginationResponse } from '@models/api/common';
import { Like } from '@models/post';
import { getNoteDetailLikes } from '@utils/apis/note';
import { getResponseDetailLikes } from '@utils/apis/responses';

function Likes() {
  const { noteId, responseId } = useParams();
  const navigate = useNavigate();
  const [t] = useTranslation('translation', { keyPrefix: 'likes' });
  const [likes, setLikes] = useState<Like[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);

  // TODO : search query
  const [query, setQuery] = useState('');

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchLikes(nextPage ?? null);
  });

  const getLikes = async (page: string | null): Promise<PaginationResponse<Like[]>> => {
    if (noteId) return getNoteDetailLikes(Number(noteId), page);
    if (responseId) return getResponseDetailLikes(Number(responseId), page);
    return { results: [], next: null, previous: null, count: 0 };
  };

  const fetchLikes = async (page: string | null) => {
    const { results, next } = await getLikes(page);
    if (!results) return;
    setNextPage(next);
    setLikes([...likes, ...results]);
    setIsLoading(false);
  };

  const handleClickFriend = (username: string) => {
    return navigate(`/users/${username}`);
  };

  return (
    <MainContainer>
      <SubHeader title={t('title')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%" ph={16}>
        <Layout.LayoutBase pb={8} mt={20} bgColor="WHITE" w="100%">
          <SearchInput
            query={query}
            setQuery={setQuery}
            fontSize={16}
            placeholder={t('search_friends') || undefined}
            cancelText={t('cancel') || undefined}
          />
        </Layout.LayoutBase>
        {/* like list */}
        {likes.map((like) => {
          const { id, user_detail } = like;
          return (
            <Layout.FlexRow
              alignItems="center"
              pv={12}
              w="100%"
              key={id}
              onClick={() => handleClickFriend(user_detail.username)}
            >
              <Layout.FlexRow gap={14} alignItems="center">
                <ProfileImage
                  imageUrl={user_detail.profile_image}
                  username={user_detail.username}
                  size={44}
                />
                <Typo type="title-medium">{user_detail.username}</Typo>
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
    </MainContainer>
  );
}

export default Likes;
