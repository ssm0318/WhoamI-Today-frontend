import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '@components/_common/loader/Loader.styled';
import SearchInput from '@components/_common/search-input/SearchInput';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import { ChatRoom, ChatRoomMember } from '@models/chat';
import { UserProfile } from '@models/user';
import axios from '@utils/apis/axios';
import { updateGroupChat } from '@utils/apis/chat';
import { searchFriends } from '@utils/apis/user';
import { MainScrollContainer } from '../Root';

function AddGroupMembers() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [existingMembers, setExistingMembers] = useState<ChatRoomMember[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [friendsRes, roomRes] = await Promise.all([
        searchFriends(''),
        axios.get<ChatRoom>(`/chat/groups/${roomId}/`),
      ]);
      setFriends(friendsRes.results || []);
      setExistingMembers(roomRes.data.members_detail || []);
      setLoading(false);
    };
    load();
  }, [roomId]);

  const existingIds = new Set(existingMembers.map((m) => m.id));

  const availableFriends = query
    ? friends.filter(
        (f) => !existingIds.has(f.id) && f.username.toLowerCase().includes(query.toLowerCase()),
      )
    : friends.filter((f) => !existingIds.has(f.id));

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

  const handleAdd = async () => {
    if (selected.size === 0 || !roomId) return;
    setSaving(true);
    await updateGroupChat(Number(roomId), { add_member_ids: Array.from(selected) });
    navigate(`/chats/group/${roomId}`);
  };

  return (
    <MainScrollContainer>
      <SubHeader title="Add Members" />
      <Layout.FlexCol w="100%" ph={16} pv={8}>
        <SearchInput query={query} setQuery={setQuery} placeholder="Search friends..." />
      </Layout.FlexCol>
      {loading && (
        <Layout.FlexCol w="100%" alignItems="center" mt={20}>
          <Loader />
        </Layout.FlexCol>
      )}
      {!loading && availableFriends.length === 0 && (
        <Layout.FlexCol w="100%" alignItems="center" mt={30}>
          <Typo type="body-medium" color="MEDIUM_GRAY">
            No friends to add.
          </Typo>
        </Layout.FlexCol>
      )}
      {availableFriends.map((friend) => (
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
      {selected.size > 0 && (
        <Layout.FlexRow w="100%" ph={16} pv={12} justifyContent="center">
          <Layout.FlexRow
            ph={24}
            pv={10}
            rounded={8}
            bgColor="PRIMARY"
            cursor="pointer"
            onClick={handleAdd}
            alignItems="center"
            justifyContent="center"
          >
            <Typo type="title-medium" color="WHITE">
              {saving ? 'Adding...' : `Add ${selected.size} Member${selected.size > 1 ? 's' : ''}`}
            </Typo>
          </Layout.FlexRow>
        </Layout.FlexRow>
      )}
    </MainScrollContainer>
  );
}

export default AddGroupMembers;
