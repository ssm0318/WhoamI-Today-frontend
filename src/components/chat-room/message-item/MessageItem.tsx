import { useMemo } from 'react';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import { ChatMessage } from '@models/api/chat';
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
  message: ChatMessage;
}

// TODO: 비밀댓글 게시물 케이스 추가
export function MessageItem({ message }: Props) {
  const { sender, timestamp, content } = message;
  const isUserAuthor = useBoundStore((state) => state.isUserAuthor);

  const isMyMsg = useMemo(() => {
    return isUserAuthor(sender.id);
  }, [isUserAuthor, sender.id]);

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
        <ProfileImage imageUrl={sender.profile_image} size={40} />
        <LeftMessageContent>
          <Typo type="body-medium">{content}</Typo>
        </LeftMessageContent>
      </Layout.FlexRow>
      <StyledTime>{formattedTime}</StyledTime>
    </LeftMessageWrapper>
  );
}
