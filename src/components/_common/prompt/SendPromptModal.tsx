import { ChangeEvent, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import FriendSearchInput from '@components/friends/explore-friends/friend-search/FriendSearchInput';
import { Button, Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { UpdatedProfile } from '@models/api/friends';
import { StyledCheckBox } from 'src/design-system/Inputs/CheckBox.styled';
import { LayoutBase } from 'src/design-system/layouts';
import useInfiniteFetchFriends from 'src/routes/friends/_hooks/useInfiniteFetchFriends';
import BottomModal from '../bottom-modal/BottomModal';
import { Divider } from '../divider/Divider.styled';
import { Loader } from '../loader/Loader.styled';
import ProfileImage from '../profile-image/ProfileImage';
import {
  MessageInput,
  SendPromptModalContainer,
  SendPromptModalFriendList,
  SendPromptModalTitle,
} from './SendPromptModal.styled';

interface SendPromptModalProps {
  visible: boolean;
  onClose: () => void;
}
function SendPromptModal({ visible, onClose }: SendPromptModalProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'prompts' });

  const [query, setQuery] = useState('');
  const { isLoadingMoreAllFriends, allFriends, fetchAllFriends, targetRef } =
    useInfiniteFetchFriends({ filterHidden: true });

  const [selectedFriends, setSelectedFriends] = useState<UpdatedProfile[]>([]);
  const [messageInput, setMessageInput] = useState('');

  const handleChangeCheckBox = (updateFriend: UpdatedProfile) => () => {
    const checkedIndex = selectedFriends.findIndex((friend) => friend.id === updateFriend.id);
    if (checkedIndex !== -1) {
      setSelectedFriends((prev) => [
        ...prev.slice(0, checkedIndex),
        ...prev.slice(checkedIndex + 1),
      ]);
      return;
    }

    setSelectedFriends((prev) => [...prev, updateFriend]);
  };

  useAsyncEffect(async () => {
    if (!visible) return;
    fetchAllFriends();
  }, [visible]);

  const handleChangeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
  };

  // TODO: cleanup(selectedFriends, scroll)

  return createPortal(
    <BottomModal visible={visible} onClose={onClose} h={650}>
      <SendPromptModalContainer>
        <LayoutBase w={75} h={5} bgColor="MEDIUM_GRAY" />
        <SendPromptModalTitle type="title-large">{t('send_this_prompt_to')}</SendPromptModalTitle>
        <LayoutBase pb={8} bgColor="WHITE" w="100%">
          <FriendSearchInput
            query={query}
            setQuery={setQuery}
            fontSize={16}
            placeholder={t('search_friends') || undefined}
          />
        </LayoutBase>
        <SendPromptModalFriendList ph={12} w="100%">
          {allFriends.state === 'loading' && <Loader />}
          {allFriends.state === 'hasValue' && allFriends.data.results && (
            <>
              {allFriends.data.results.map((friend) => {
                const { username, profile_image } = friend;
                const checked = !!selectedFriends.find((f) => f.id === friend.id);
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
              <div ref={targetRef} />
              {isLoadingMoreAllFriends && allFriends.data.next && <Loader />}
            </>
          )}
        </SendPromptModalFriendList>
        {selectedFriends.length !== 0 && (
          <Layout.Fixed b={0} w="100%" pt={12} bgColor="WHITE">
            <Divider width={1} />
            <MessageInput
              placeholder={t('write_a_message') || ''}
              value={messageInput}
              onChange={handleChangeMessage}
            />
            <Divider width={1} />
            <LayoutBase pv={12} ph={16} w="100%">
              <Button.Confirm text={t('send_separately')} status="normal" sizing="stretch" />
            </LayoutBase>
          </Layout.Fixed>
        )}
      </SendPromptModalContainer>
    </BottomModal>,
    document.getElementById('root-container') || document.body,
  );
}

export default SendPromptModal;
