import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import NoteItem from '@components/note/note-item/NoteItem';
import NoteLoader from '@components/note/note-loader/NoteLoader';
import ResponseItem from '@components/response/response-item/ResponseItem';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import axiosInstance from '@utils/apis/axios';
import { MainScrollContainer } from '../Root';

interface UnreadPost {
  id: number;
  type: 'Note' | 'Response';
  [key: string]: any;
}

function FriendNewPosts() {
  const { username } = useParams<{ username: string }>();
  const [posts, setPosts] = useState<UnreadPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { mutate: globalMutate } = useSWRConfig();

  const fetchPosts = async () => {
    if (!username) return;
    setIsLoading(true);
    try {
      // Try unread first; if empty, fall back to recent posts
      const { data: unread } = await axiosInstance.get<UnreadPost[]>(
        `/user/${username}/unread-posts/`,
      );
      if (unread.length > 0) {
        setPosts(unread);
      } else {
        // Fall back to all posts from this user (most recent)
        const { data: allPosts } = await axiosInstance.get<{ results: UnreadPost[] }>(
          `/user/${username}/all-posts/?page=1`,
        );
        setPosts((allPosts.results ?? allPosts) as UnreadPost[]);
      }
    } catch {
      setPosts([]);
    } finally {
      setIsLoading(false);
      // Invalidate friends list cache so "New post" badge disappears on return
      globalMutate(
        (key: string) => typeof key === 'string' && key.includes('/user/friends/'),
        undefined,
        { revalidate: true },
      );
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    <MainScrollContainer>
      <SubHeader title={`${username}'s posts`} />
      <PullToRefresh onRefresh={fetchPosts}>
        <Layout.FlexCol w="100%" gap={16} ph={16} pv={12}>
          {isLoading ? (
            <>
              <NoteLoader />
              <NoteLoader />
            </>
          ) : posts.length > 0 ? (
            posts.map((post) => {
              if (post.type === 'Note') {
                return <NoteItem key={`note-${post.id}`} note={post as any} isMyPage={false} />;
              }
              if (post.type === 'Response') {
                return (
                  <ResponseItem
                    key={`response-${post.id}`}
                    response={post as any}
                    displayType="FEED"
                  />
                );
              }
              return null;
            })
          ) : (
            <Layout.FlexCol w="100%" alignItems="center" pv={40}>
              <Typo type="body-medium" color="MEDIUM_GRAY" textAlign="center">
                No new posts
              </Typo>
            </Layout.FlexCol>
          )}
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default FriendNewPosts;
