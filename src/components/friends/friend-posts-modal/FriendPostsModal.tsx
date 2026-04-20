import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSWRConfig } from 'swr';
import NoteItem from '@components/note/note-item/NoteItem';
import NoteLoader from '@components/note/note-loader/NoteLoader';
import ResponseItem from '@components/response/response-item/ResponseItem';
import { Layout, Typo } from '@design-system';
import { Note, Response } from '@models/post';
import axiosInstance from '@utils/apis/axios';

interface FriendPostsModalProps {
  visible: boolean;
  username: string;
  onClose: () => void;
}

type RecentPost = (Note | Response) & { created_at?: string };

const HOURS_24_MS = 24 * 60 * 60 * 1000;

function FriendPostsModal({ visible, username, onClose }: FriendPostsModalProps) {
  const [posts, setPosts] = useState<RecentPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: globalMutate } = useSWRConfig();

  useEffect(() => {
    if (!visible || !username) return;

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get<RecentPost[]>(
          `/user/${encodeURIComponent(username)}/unread-posts/`,
        );
        const recentPosts = (Array.isArray(data) ? data : []).filter((post) => {
          if (!post.created_at) return true;
          const createdAt = new Date(post.created_at);
          if (Number.isNaN(createdAt.getTime())) return false;
          return Date.now() - createdAt.getTime() <= HOURS_24_MS;
        });
        setPosts(recentPosts);
      } catch {
        setPosts([]);
      } finally {
        setIsLoading(false);
        globalMutate(
          (key: string) => typeof key === 'string' && key.includes('/user/friends/'),
          undefined,
          { revalidate: true },
        );
      }
    };

    fetchPosts();
  }, [globalMutate, username, visible]);

  if (!visible) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between" mb={12}>
          <Typo type="title-large">{username}&apos;s recent posts</Typo>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </Layout.FlexRow>

        <ScrollableBody>
          {isLoading ? (
            <>
              <NoteLoader />
              <NoteLoader />
            </>
          ) : posts.length > 0 ? (
            <Layout.FlexCol w="100%" gap={16}>
              {posts.map((post) => {
                if (post.type === 'Note') {
                  return <NoteItem key={`note-${post.id}`} note={post as Note} isMyPage={false} />;
                }
                if (post.type === 'Response') {
                  return (
                    <ResponseItem
                      key={`response-${post.id}`}
                      response={post as Response}
                      displayType="FEED"
                      isMyPage={false}
                    />
                  );
                }
                return null;
              })}
            </Layout.FlexCol>
          ) : (
            <Layout.FlexCol w="100%" alignItems="center" pv={36}>
              <Typo type="body-medium" color="MEDIUM_GRAY">
                No recent posts
              </Typo>
            </Layout.FlexCol>
          )}
        </ScrollableBody>
      </ModalCard>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
`;

const ModalCard = styled.div`
  width: min(680px, calc(100% - 32px));
  max-height: 80vh;
  border-radius: 16px;
  background: white;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const ScrollableBody = styled.div`
  overflow-y: auto;
  min-height: 120px;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: #8700ff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

export default FriendPostsModal;
