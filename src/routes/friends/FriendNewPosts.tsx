import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

  const fetchPosts = async () => {
    if (!username) return;
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get<UnreadPost[]>(`/user/${username}/unread-posts/`);
      setPosts(data);
    } catch {
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    <MainScrollContainer>
      <SubHeader title={`${username}'s new posts`} />
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
                return <NoteItem key={`note-${post.id}`} note={post} isMyPage={false} />;
              }
              if (post.type === 'Response') {
                return (
                  <ResponseItem key={`response-${post.id}`} response={post} displayType="FEED" />
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
