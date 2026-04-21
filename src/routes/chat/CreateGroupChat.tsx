import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import { Loader } from '@components/_common/loader/Loader.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SearchInput from '@components/_common/search-input/SearchInput';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { createGroupChat } from '@utils/apis/chat';
import { searchFriends } from '@utils/apis/user';
import { MainScrollContainer } from '../Root';

function CreateGroupChat() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [groupName, setGroupName] = useState('');
  const [groupMode, setGroupMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));
  const MAX_OTHER_MEMBERS = 9; // 9 others + you = 10 total

  useAsyncEffect(async () => {
    const { results } = await searchFriends('');
    setFriends(results || []);
    setLoading(false);
  }, []);

  const filteredFriends = query
    ? friends.filter((f) => f.username.toLowerCase().includes(query.toLowerCase()))
    : friends;

  const toggleSelect = (userId: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        if (next.size >= MAX_OTHER_MEMBERS) {
          openToast({ message: 'Group chats can have up to 10 members.' });
          return prev;
        }
        next.add(userId);
      }
      return next;
    });
  };

  const handleCreateGroup = async () => {
    if (selected.size < 2) return;
    setCreating(true);
    try {
      const room = await createGroupChat(groupName || 'Group Chat', Array.from(selected));
      navigate(`/chats/group/${room.id}`);
    } catch {
      setCreating(false);
    }
  };

  return (
    <MainScrollContainer>
      <SubHeader title="New Chat" />
      <Layout.FlexCol w="100%" ph={16} pv={8} gap={10}>
        <SearchInput query={query} setQuery={setQuery} placeholder="Search..." />
        {groupMode ? (
          <Layout.FlexRow w="100%" gap={8}>
            <button
              type="button"
              onClick={() => {
                setGroupMode(false);
                setSelected(new Set());
                setGroupName('');
              }}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 10,
                border: '1.5px solid #D9D9D9',
                background: 'white',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: '#666',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={selected.size >= 2 ? handleCreateGroup : undefined}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 10,
                border: 'none',
                background: selected.size >= 2 ? '#8700FF' : '#D9D9D9',
                cursor: selected.size >= 2 ? 'pointer' : 'default',
                fontSize: 14,
                fontWeight: 600,
                color: 'white',
              }}
            >
              {creating ? 'Creating...' : `Create Group (${selected.size}/${MAX_OTHER_MEMBERS})`}
            </button>
          </Layout.FlexRow>
        ) : (
          <button
            type="button"
            onClick={() => setGroupMode(true)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: 'none',
              background: '#8700FF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <EmojiItem emojiString="👥" size={16} bgColor="TRANSPARENT" outline="TRANSPARENT" />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>New Group Chat</span>
          </button>
        )}
      </Layout.FlexCol>

      {/* Group name + selected chips */}
      {groupMode && selected.size > 0 && (
        <Layout.FlexCol w="100%" ph={16} pv={4} gap={6}>
          <Layout.FlexRow gap={6} style={{ flexWrap: 'wrap' }}>
            {Array.from(selected).map((id) => {
              const friend = friends.find((f) => f.id === id);
              if (!friend) return null;
              return (
                <Layout.FlexRow
                  key={id}
                  ph={10}
                  pv={4}
                  rounded={16}
                  bgColor="LIGHT"
                  gap={4}
                  alignItems="center"
                  cursor="pointer"
                  onClick={() => toggleSelect(id)}
                >
                  <Typo type="label-medium" color="BLACK">
                    {friend.username}
                  </Typo>
                  <Typo type="label-small" color="MEDIUM_GRAY">
                    ✕
                  </Typo>
                </Layout.FlexRow>
              );
            })}
          </Layout.FlexRow>
          {selected.size >= 2 && (
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name (optional)"
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: 14,
                border: '1px solid #D9D9D9',
                borderRadius: 8,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          )}
        </Layout.FlexCol>
      )}

      {/* Friend list */}
      <Layout.FlexCol w="100%" style={{ flex: 1 }}>
        {loading && (
          <Layout.FlexCol w="100%" alignItems="center" mt={20}>
            <Loader />
          </Layout.FlexCol>
        )}
        {filteredFriends.map((friend) => {
          const isSelected = selected.has(friend.id);
          return (
            <Layout.FlexRow
              key={friend.id}
              w="100%"
              ph={16}
              pv={10}
              gap={12}
              alignItems="center"
              cursor="pointer"
              onClick={() => {
                if (groupMode) {
                  toggleSelect(friend.id);
                } else {
                  navigate(`/users/${friend.id}/chat`);
                }
              }}
              style={{ borderBottom: '1px solid #F0F0F0' }}
            >
              {groupMode && (
                <Layout.FlexRow
                  w={24}
                  h={24}
                  rounded={12}
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    border: `2px solid ${isSelected ? '#8700FF' : '#D9D9D9'}`,
                    background: isSelected ? '#8700FF' : 'transparent',
                  }}
                >
                  {isSelected && (
                    <Typo type="label-small" color="WHITE">
                      ✓
                    </Typo>
                  )}
                </Layout.FlexRow>
              )}
              <ProfileImage imageUrl={friend.profile_image} size={36} />
              <Typo type="body-large" color="BLACK">
                {friend.username}
              </Typo>
            </Layout.FlexRow>
          );
        })}
      </Layout.FlexCol>

      {/* Bottom create button removed — handled by top split buttons */}
    </MainScrollContainer>
  );
}

export default CreateGroupChat;
