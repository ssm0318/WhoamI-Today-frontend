import { useMemo } from 'react';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { MOCK_MESSAGE_LIST } from '@components/chat-room/message-list/MessageList.helper';
import { Font, Layout } from '@design-system';
import { getTime } from './MessageItem.helper';
import {
  LeftMessageContent,
  LeftMessageWrapper,
  RightMessageContent,
  RightMessageWrapper,
  StyledTime,
} from './MessageItem.styled';

interface Props {
  content: string; // FIXME: 단순 text 이외의 케이스 추가
  author: { username: string; imageUrl: string };
  created_at: string;
}

// TODO: 비밀댓글 게시물 케이스 추가
export function MessageItem({ content, author, created_at }: Props) {
  const isUserAuthor = useMemo(() => {
    // FIXME: 메시지 작성자 판별
    return author.username === MOCK_MESSAGE_LIST[0].author.username;
  }, [author.username]);

  const formattedTime = getTime(created_at);

  return isUserAuthor ? (
    <LeftMessageWrapper>
      <Layout.FlexRow gap={10}>
        <ProfileImage imageUrl={author.imageUrl} size={40} />
        <LeftMessageContent>
          <Font.Body type="14_regular">{content}</Font.Body>
        </LeftMessageContent>
      </Layout.FlexRow>
      <StyledTime>{formattedTime}</StyledTime>
    </LeftMessageWrapper>
  ) : (
    <RightMessageWrapper>
      <StyledTime>{formattedTime}</StyledTime>
      <RightMessageContent>
        <Font.Body type="14_regular">{content}</Font.Body>
      </RightMessageContent>
    </RightMessageWrapper>
  );
}
