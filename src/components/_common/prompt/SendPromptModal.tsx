import { useState } from 'react';
import { createPortal } from 'react-dom';
import FriendSearchInput from '@components/friends/explore-friends/friend-search/FriendSearchInput';
import { Layout, Typo } from '@design-system';
import { LayoutBase } from 'src/design-system/layouts';
import BottomModal from '../bottom-modal/BottomModal';

interface SendPromptModalProps {
  visible: boolean;
  onClose: () => void;
}
function SendPromptModal({ visible, onClose }: SendPromptModalProps) {
  const [query, setQuery] = useState('');

  return createPortal(
    <BottomModal visible={visible} onClose={onClose}>
      <LayoutBase alignItems="center" pt={16} pb={21} ph={16} w="100%" bgColor="WHITE">
        <LayoutBase w={75} h={5} bgColor="MEDIUM_GRAY" mb={12} />
        <Typo type="title-large">Send this prompt to...</Typo>
        <Layout.FlexCol pt={12} w="100%">
          <FriendSearchInput query={query} setQuery={setQuery} fontSize={16} />
          {/* TODO: Friends item */}
        </Layout.FlexCol>
      </LayoutBase>
    </BottomModal>,
    document.getElementById('root-container') || document.body,
  );
}

export default SendPromptModal;
