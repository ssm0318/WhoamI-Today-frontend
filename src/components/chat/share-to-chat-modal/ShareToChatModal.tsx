import { useCallback, useState } from 'react';
import { Loader } from '@components/_common/loader/Loader.styled';
import SearchInput from '@components/_common/search-input/SearchInput';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { UserProfile } from '@models/user';
import { ModalContainer } from '@styles/wrappers';
import { postChatMessage } from '@utils/apis/chat';
import { searchFriends } from '@utils/apis/user';

interface Props {
  visible: boolean;
  contentType: string;
  contentId: number;
  onClose: () => void;
}

function ShareToChatModal({ visible, contentType, contentId, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useAsyncEffect(async () => {
    if (!visible) return;
    const { results } = await searchFriends('');
    setFriends(results || []);
    setLoading(false);
  }, [visible]);

  const filteredFriends = query
    ? friends.filter((f) => f.username.toLowerCase().includes(query.toLowerCase()))
    : friends;

  const toggleSelect = (userId: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleSend = useCallback(async () => {
    if (selected.size === 0) return;
    setSending(true);
    const promises = Array.from(selected).map((friendId) =>
      postChatMessage(friendId, {
        emoji: '',
        content: '',
        shared_content_type: contentType,
        shared_object_id: contentId,
      }).catch(() => {}),
    );
    await Promise.all(promises);
    setSending(false);
    onClose();
  }, [selected, contentType, contentId, onClose]);

  if (!visible) return null;

  return (
    <ModalContainer>
      <Layout.FlexCol w="100%" h="100%" bgColor="WHITE">
        <Layout.FlexRow w="100%" ph={16} pv={12} justifyContent="space-between" alignItems="center">
          <Typo type="title-large" color="BLACK">
            Send to Chat
          </Typo>
          <button
            type="button"
            onClick={onClose}
            style={{ cursor: 'pointer', background: 'none', border: 'none' }}
          >
            <Typo type="label-large" color="MEDIUM_GRAY">
              Cancel
            </Typo>
          </button>
        </Layout.FlexRow>
        <Layout.FlexCol w="100%" ph={16} pv={8}>
          <SearchInput query={query} setQuery={setQuery} placeholder="Search friends..." />
        </Layout.FlexCol>
        <Layout.FlexCol w="100%" style={{ flex: 1, overflowY: 'auto' }}>
          {loading && (
            <Layout.FlexCol w="100%" alignItems="center" mt={20}>
              <Loader />
            </Layout.FlexCol>
          )}
          {filteredFriends.map((friend) => (
            <Layout.FlexRow
              key={friend.id}
              w="100%"
              ph={16}
              pv={10}
              gap={12}
              alignItems="center"
              cursor="pointer"
              onClick={() => toggleSelect(friend.id)}
              style={{ borderBottom: '1px solid #F0F0F0' }}
            >
              <Layout.FlexRow
                w={24}
                h={24}
                rounded={12}
                alignItems="center"
                justifyContent="center"
                style={{
                  border: `2px solid ${selected.has(friend.id) ? '#8700FF' : '#D9D9D9'}`,
                  background: selected.has(friend.id) ? '#8700FF' : 'transparent',
                }}
              >
                {selected.has(friend.id) && (
                  <Typo type="label-small" color="WHITE">
                    ✓
                  </Typo>
                )}
              </Layout.FlexRow>
              <Typo type="body-large" color="BLACK">
                {friend.username}
              </Typo>
            </Layout.FlexRow>
          ))}
        </Layout.FlexCol>
        {selected.size > 0 && (
          <Layout.FlexRow w="100%" ph={16} pv={12} justifyContent="center">
            <Layout.FlexRow
              ph={24}
              pv={10}
              rounded={8}
              bgColor="PRIMARY"
              cursor="pointer"
              onClick={handleSend}
              alignItems="center"
              justifyContent="center"
            >
              <Typo type="title-medium" color="WHITE">
                {sending
                  ? 'Sending...'
                  : `Send to ${selected.size} friend${selected.size > 1 ? 's' : ''}`}
              </Typo>
            </Layout.FlexRow>
          </Layout.FlexRow>
        )}
      </Layout.FlexCol>
    </ModalContainer>
  );
}

export default ShareToChatModal;
