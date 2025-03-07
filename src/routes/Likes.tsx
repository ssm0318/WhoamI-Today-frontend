import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import NoContents from '@components/_common/no-contents/NoContents';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PaginationResponse } from '@models/api/common';
import { Like } from '@models/post';
import { getCommentLikes } from '@utils/apis/comments';
import { getNoteDetailLikes } from '@utils/apis/note';
import { getResponseDetailLikes } from '@utils/apis/responses';
import { isValidId } from '@utils/validateHelpers';

function Likes() {
  const { noteId, responseId, commentId } = useParams();
  const navigate = useNavigate();
  const [t] = useTranslation('translation', { keyPrefix: 'likes' });
  const [likes, setLikes] = useState<Like[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchLikes(nextPage ?? null);
  });

  const getLikes = async (page: string | null): Promise<PaginationResponse<Like[]>> => {
    if (isValidId(commentId)) return getCommentLikes(Number(commentId), page);
    if (isValidId(noteId)) return getNoteDetailLikes(Number(noteId), page);
    if (isValidId(responseId)) return getResponseDetailLikes(Number(responseId), page);

    return { results: [], next: null, previous: null, count: 0 };
  };

  const fetchLikes = async (page: string | null) => {
    try {
      const { results, next } = await getLikes(page);
      if (results) {
        setLikes((prevLikes) => [...prevLikes, ...results]);
        setNextPage(next);
      }
    } catch (error) {
      handleFetchError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchError = (error: unknown) => {
    setLikes([]);
    setNextPage(null);
    setIsError(true);

    if (isAxiosError(error)) {
      if (error.response?.status === 403) {
        setErrorMessage(t('forbidden_post_or_comment'));
      } else {
        setErrorMessage(t('not_found_post_or_comment'));
      }
    } else {
      setErrorMessage(t('forbidden_post_or_comment'));
    }
  };

  const handleClickFriend = (username: string) => {
    return navigate(`/users/${username}`);
  };

  return (
    <MainContainer>
      <SubHeader title={t('title')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%" ph={16}>
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
        {isError && (
          <Layout.FlexCol w="100%" alignItems="center" mt={TITLE_HEADER_HEIGHT + 12} ph={16}>
            <NoContents title={errorMessage} />
          </Layout.FlexCol>
        )}
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
