import { useContext } from 'react';
import { SwipeLayout } from '@components/_common/swipe-layout/SwipeLayout';
import { SwipeLayoutListContext } from '@components/_common/swipe-layout/SwipeLayoutList';
import { StyledSwipeButton } from '@components/chats/chat-room-list/ChatRoomItem.styled';
import { Typo } from '@design-system';
import { ChatRoom } from '@models/api/chat';
import { ChatRoomItem } from './ChatRoomItem';

interface Props {
  room: ChatRoom;
}

export function SwipeableChatRoomItem({ room }: Props) {
  const { hasSwipedItem } = useContext(SwipeLayoutListContext);

  return (
    <SwipeLayout
      rightContent={[
        <StyledSwipeButton key="mute" backgroundColor="MEDIUM_GRAY">
          <Typo type="body-medium" color="WHITE" textAlign="center">
            Mute
          </Typo>
        </StyledSwipeButton>,
        <StyledSwipeButton key="delete" backgroundColor="ERROR">
          <Typo type="body-medium" color="WHITE" textAlign="center">
            Delete
          </Typo>
        </StyledSwipeButton>,
      ]}
    >
      <ChatRoomItem room={room} hasSwipedItem={hasSwipedItem} />
    </SwipeLayout>
  );
}
