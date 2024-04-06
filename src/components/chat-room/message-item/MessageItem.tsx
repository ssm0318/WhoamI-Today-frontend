import { useMemo } from 'react';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import { ChatRoom, ChatSocketData } from '@models/api/chat';
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
  message: ChatSocketData;
}

// TODO: 비밀댓글 게시물 케이스 추가
export function MessageItem({ room, message }: Props) {
  const { userName, timestamp, content } = message;
  const currentUser = useBoundStore((state) => state.myProfile);

  const isMyMsg = useMemo(() => {
    return userName === currentUser?.username;
  }, [currentUser?.username, userName]);

  const formattedTime = getTime(timestamp);

  return isMyMsg ? (
    <RightMessageWrapper>
      <StyledTime>{formattedTime}</StyledTime>
      <RightMessageContent>
        <Typo type="body-medium">{content}</Typo>
      </RightMessageContent>
    </RightMessageWrapper>
  ) : (
    <LeftMessageWrapper>
      <Layout.FlexRow gap={10}>
        <ProfileImage imageUrl={room.participants[0].profile_image} size={40} />
        <LeftMessageContent>
          <Typo type="body-medium">{content}</Typo>
        </LeftMessageContent>
      </Layout.FlexRow>
      <StyledTime>{formattedTime}</StyledTime>
    </LeftMessageWrapper>
  );
}
