import { useMemo } from 'react';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import { ChatRoom, ResponseMessageAction } from '@models/api/chat';
import { useBoundStore } from '@stores/useBoundStore';
import { getTime } from './MessageItem.helper';
import {
  LeftMessageContent,
  LeftMessageWrapper,
  RightMessageContent,
  RightMessageWrapper,
  StyledTime,
} from './MessageItem.styled';

interface Props {
  room: ChatRoom;
  message: ResponseMessageAction;
  like: (messageId: number) => void;
  removeLike: (messageLikeId: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function MessageItem({ room, message, like, removeLike }: Props) {
  const { userName, timestamp, content } = message;
  const currentUser = useBoundStore((state) => state.myProfile);

  const isMyMsg = useMemo(() => {
    return userName === currentUser?.username;
  }, [currentUser?.username, userName]);

  const formattedTime = getTime(timestamp);

  const handleDoubleClickMsg = () => {
    // TODO: like, removeLike 연결
  };

  return isMyMsg ? (
    <RightMessageWrapper>
      <StyledTime>{formattedTime}</StyledTime>
      <RightMessageContent onDoubleClick={handleDoubleClickMsg}>
        <Typo type="body-medium">{content}</Typo>
      </RightMessageContent>
    </RightMessageWrapper>
  ) : (
    <LeftMessageWrapper>
      <Layout.FlexRow gap={10}>
        <ProfileImage imageUrl={room.participants[0].profile_image} size={40} />
        <LeftMessageContent onDoubleClick={handleDoubleClickMsg}>
          <Typo type="body-medium">{content}</Typo>
        </LeftMessageContent>
      </Layout.FlexRow>
      <StyledTime>{formattedTime}</StyledTime>
    </LeftMessageWrapper>
  );
}
