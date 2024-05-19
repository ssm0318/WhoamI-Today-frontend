import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Button, Layout, StyledCheckBox, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
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
    fetchAllFriends,
    targetRef: allFriendsTargetRef,
  } = useInfiniteFetchFriends({ filterHidden: true });

  useAsyncEffect(async () => {
    if (!visible) return;
    fetchAllFriends();
  }, [visible]);

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
      onSuccess: () => onClose,
      onError: () => openToast({ message: t('error.temporary_error') }),
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
    <BottomModal visible={visible} onClose={onClose} h={650}>
      <SendPromptModalContainer>
        <Layout.LayoutBase w={75} h={5} bgColor="MEDIUM_GRAY" />
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
                    const { username, profile_image } = friend;
                    const checked = !!selectedFriends.find((id) => id === friend.id);
                    return (
                      <Layout.FlexRow
                        key={username}
                        alignItems="center"
                        justifyContent="space-between"
                        pv={12}
                        w="100%"
                      >
                        <Layout.FlexRow gap={8} alignItems="center">
                          <ProfileImage imageUrl={profile_image} username={username} size={30} />
                          <Typo type="title-medium">{username}</Typo>
                        </Layout.FlexRow>
                        <StyledCheckBox onChange={handleChangeCheckBox(friend)} checked={checked} />
                      </Layout.FlexRow>
                    );
                  })}
                  <div ref={searchFriendsTargetRef} />
                  {isLoadingSearchFriends && nextUrl && <Loader />}
                </>
              )}
            </>
          ) : (
            <>
              {allFriends.state === 'loading' && <Loader />}
              {allFriends.state === 'hasValue' && allFriends.data.results && (
                <>
                  {allFriends.data.results.map((friend) => {
                    const { username, profile_image } = friend;
                    const checked = !!selectedFriends.find((id) => id === friend.id);
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
                        <StyledCheckBox onChange={handleChangeCheckBox(friend)} checked={checked} />
                      </Layout.FlexRow>
                    );
                  })}
                  <div ref={allFriendsTargetRef} />
                  {isLoadingMoreAllFriends && allFriends.data.next && <Loader />}
                </>
              )}
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

export default SendPromptModal;
