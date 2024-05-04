import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import FriendSearchInput from '@components/friends/explore-friends/friend-search/FriendSearchInput';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { LayoutBase } from 'src/design-system/layouts';
import useInfiniteFetchFriends from 'src/routes/friends/_hooks/useInfiniteFetchFriends';
import BottomModal from '../bottom-modal/BottomModal';
import { Loader } from '../loader/Loader.styled';
import ProfileImage from '../profile-image/ProfileImage';
import {
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

  useAsyncEffect(async () => {
    if (!visible) return;
    fetchAllFriends();
  }, [visible]);

  return createPortal(
    <BottomModal visible={visible} onClose={onClose} h={650}>
      <SendPromptModalContainer>
        <LayoutBase w={75} h={5} bgColor="MEDIUM_GRAY" />
        <SendPromptModalTitle type="title-large">{t('send_this_prompt_to')}</SendPromptModalTitle>
        <FriendSearchInput
          query={query}
          setQuery={setQuery}
          fontSize={16}
          placeholder={t('search_friends') || undefined}
        />
        <SendPromptModalFriendList pt={8} ph={18} w="100%">
          {allFriends.state === 'loading' && <Loader />}
          {allFriends.state === 'hasValue' && allFriends.data.results && (
            <>
              {allFriends.data.results.map(({ username, profile_image }) => (
                <Layout.FlexRow key={username} alignItems="center" gap={8} pv={12} w="100%">
                  <ProfileImage imageUrl={profile_image} username={username} size={30} />
                  <Typo type="title-medium">{username}</Typo>
                </Layout.FlexRow>
              ))}
              <div ref={targetRef} />
              {isLoadingMoreAllFriends && allFriends.data.next && <Loader />}
            </>
          )}
        </SendPromptModalFriendList>
      </SendPromptModalContainer>
    </BottomModal>,
    document.getElementById('root-container') || document.body,
  );
}

export default SendPromptModal;
