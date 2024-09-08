import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Button, Layout, StyledCheckBox, Typo } from '@design-system';
import useInfiniteFetchFriends from '@hooks/useInfiniteFetchFriends';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { FetchState } from '@models/api/common';
import { UpdatedProfile } from '@models/api/friends';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { requestResponse } from '@utils/apis/question';
import { searchFriends } from '@utils/apis/user';
import BottomModal from '../bottom-modal/BottomModal';
import { Divider } from '../divider/Divider.styled';
import { Loader } from '../loader/Loader.styled';
import ProfileImage from '../profile-image/ProfileImage';
import SearchInput from '../search-input/SearchInput';
import {
  MessageInput,
  SendPromptModalContainer,
  SendPromptModalFriendList,
  SendPromptModalTitle,
} from './SendPromptModal.styled';

interface SendPromptModalProps {
  visible: boolean;
  onClose: () => void;
  questionId: number;
}
function SendPromptModal({ visible, onClose, questionId }: SendPromptModalProps) {
  const [t] = useTranslation('translation');

  const [query, setQuery] = useState('');
  const {
    isLoadingMoreAllFriends,
    allFriends,
    targetRef: allFriendsTargetRef,
  } = useInfiniteFetchFriends();

  const [searchedFriendsList, setSearchFriendsList] = useState<FetchState<UserProfile[]>>({
    state: 'loading',
  });
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const fetchSearchUsers = useCallback(async (_query: string, _next?: string | null) => {
    const { results = [], next } = await searchFriends(_query, _next);
    setSearchFriendsList((prev) =>
      _next
        ? prev?.data
          ? { state: 'hasValue', data: [...prev.data, ...results] }
          : { state: 'hasValue', data: [] }
        : { state: 'hasValue', data: results },
    );
    setNextUrl(next);
  }, []);

  const {
    isLoading: isLoadingSearchFriends,
    setIsLoading: setSearchFriendsLoading,
    targetRef: searchFriendsTargetRef,
  } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextUrl) await fetchSearchUsers(query, nextUrl);
    setSearchFriendsLoading(false);
  });

  useEffect(() => {
    if (!query) return;
    fetchSearchUsers(query);
  }, [fetchSearchUsers, query]);

  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [messageInput, setMessageInput] = useState('');

  const handleChangeCheckBox = (updateFriend: UpdatedProfile | UserProfile) => () => {
    const checkedIndex = selectedFriends.findIndex((friendId) => friendId === updateFriend.id);
    if (checkedIndex !== -1) {
      setSelectedFriends((prev) => [
        ...prev.slice(0, checkedIndex),
        ...prev.slice(checkedIndex + 1),
      ]);
      return;
    }

    setSelectedFriends((prev) => [...prev, updateFriend.id]);
  };

  const handleChangeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
  };

  const currentUser = useBoundStore.getState().myProfile;
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));
  const handleClickSend = async () => {
    if (!currentUser) return;
    await requestResponse({
      currentUserId: currentUser.id,
      questionId,
      selectedFriends,
      message: messageInput,
      onSuccess: () => {
        openToast({ message: t('prompts.sent_success') });
        onClose();
      },
      onError: (errorMsg) => openToast({ message: errorMsg ?? t('error.temporary_error') }),
    });
  };

  // NOTE: Clean up on close modal
  const friendListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (visible || !friendListRef.current) return;
    setQuery('');
    setSearchFriendsList({ state: 'loading' });
    setNextUrl(null);
    setSelectedFriends([]);
    setMessageInput('');
    friendListRef.current.scrollTo(0, 0);
  }, [visible]);

  return createPortal(
    <BottomModal visible={visible} onClose={onClose} heightMode="full">
      <SendPromptModalContainer>
        <SendPromptModalTitle type="title-large">
          {t('prompts.send_this_prompt_to')}
        </SendPromptModalTitle>
        <Layout.LayoutBase pb={8} bgColor="WHITE" w="100%">
          <SearchInput
            query={query}
            setQuery={setQuery}
            fontSize={16}
            placeholder={t('prompts.search_friends') || undefined}
            cancelText={t('prompts.cancel') || undefined}
          />
        </Layout.LayoutBase>
        <SendPromptModalFriendList ph={12} w="100%" ref={friendListRef}>
          {query ? (
            <>
              {searchedFriendsList.state === 'loading' && <Loader />}
              {searchedFriendsList.state === 'hasValue' && (
                <>
                  {searchedFriendsList.data.map((friend) => {
                    const checked = !!selectedFriends.find((id) => id === friend.id);
                    return (
                      <SelectFriendItem
                        key={friend.id}
                        friend={friend}
                        checked={checked}
                        handleChangeCheckBox={handleChangeCheckBox}
                      />
                    );
                  })}
                  <div ref={searchFriendsTargetRef} />
                  {isLoadingSearchFriends && nextUrl && <Loader />}
                </>
              )}
            </>
          ) : (
            <>
              {/** TODO: 친구 없는 케이스 추가 */}
              {allFriends?.map(({ results }) =>
                results?.map((friend) => {
                  if (friend.is_hidden) return null;
                  const checked = !!selectedFriends.find((id) => id === friend.id);
                  return (
                    <SelectFriendItem
                      key={friend.id}
                      friend={friend}
                      checked={checked}
                      handleChangeCheckBox={handleChangeCheckBox}
                    />
                  );
                }),
              )}
              <div ref={allFriendsTargetRef} />
              {isLoadingMoreAllFriends && <Loader />}
            </>
          )}
        </SendPromptModalFriendList>
        {selectedFriends.length !== 0 && (
          <Layout.Fixed b={0} w="100%" pt={12} bgColor="WHITE">
            <Divider width={1} />
            <MessageInput
              placeholder={t('prompts.write_a_message') || ''}
              value={messageInput}
              onChange={handleChangeMessage}
            />
            <Divider width={1} />
            <Layout.LayoutBase pv={12} ph={16} w="100%">
              <Button.Confirm
                text={t('prompts.send_separately')}
                status="normal"
                sizing="stretch"
                onClick={handleClickSend}
              />
            </Layout.LayoutBase>
          </Layout.Fixed>
        )}
      </SendPromptModalContainer>
    </BottomModal>,
    document.getElementById('modal-container') || document.body,
  );
}

interface SelectFriendItemProps {
  friend: UpdatedProfile | UserProfile;
  checked: boolean;
  handleChangeCheckBox: (friend: UpdatedProfile | UserProfile) => () => void;
}

function SelectFriendItem({ friend, checked, handleChangeCheckBox }: SelectFriendItemProps) {
  const { username, profile_image } = friend;
  return (
    <Layout.FlexRow
      key={username}
      alignItems="center"
      justifyContent="space-between"
      pv={12}
      w="100%"
      onClick={handleChangeCheckBox(friend)}
    >
      <Layout.FlexRow gap={8} alignItems="center">
        <ProfileImage imageUrl={profile_image} username={username} size={30} />
        <Typo type="title-medium">{username}</Typo>
      </Layout.FlexRow>
      <StyledCheckBox
        onClick={(e) => e.stopPropagation()}
        onChange={handleChangeCheckBox(friend)}
        checked={checked}
      />
    </Layout.FlexRow>
  );
}

export default SendPromptModal;
