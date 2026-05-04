import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useSWR from 'swr';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CommentItem from '@components/comment-list/comment-item/CommentItem';
import { SCREEN_HEIGHT } from '@constants/layout';
import { Layout, SvgIcon, Typo } from '@design-system';
import { PaginationResponse } from '@models/api/common';
import { CheckInComponentEntry } from '@models/checkInEntry';
import { Comment } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { deleteComment } from '@utils/apis/comments';
import { getPrivateComments, postPrivateComment, postPrivateReply } from '@utils/apis/privateReply';

interface Props {
  entry: CheckInComponentEntry;
  friendUsername?: string;
  isOwner?: boolean;
  onClose: () => void;
  onCommentAdded: () => void;
  onCommented?: () => void;
}

const Header = styled(Layout.FlexRow)`
  width: 100%;
  height: 44px;
  align-items: center;
  justify-content: center;
  background: #fcfcfc;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
  gap: 6px;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 0;
  width: 100%;
`;

const FooterWrapper = styled.div`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
  background: white;
  flex-shrink: 0;
`;

const HintRow = styled(Layout.FlexRow)`
  width: 100%;
  padding: 6px 16px 0;
  gap: 4px;
  align-items: center;
`;

const InputRow = styled(Layout.FlexRow)`
  width: 100%;
  padding: 10px 16px 12px;
  gap: 10px;
  align-items: center;
`;

const InputBox = styled(Layout.FlexCol)`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
  border-radius: 15px;
  overflow: hidden;
`;

const ReplyBanner = styled(Layout.FlexRow)`
  padding: 3px 10px;
  background: ${({ theme }) => theme.LIGHT_GRAY};
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const TextInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 6px 4px;
  background: transparent;

  &::placeholder {
    color: ${({ theme }) => theme.MEDIUM_GRAY};
  }
`;

const PostButton = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  margin-right: 2px;
  padding: 4px 10px;
  border: none;
  border-radius: 14px;
  background: ${({ $active }) => ($active ? '#87DFFF' : '#E8E8E8')};
  cursor: ${({ $active }) => ($active ? 'pointer' : 'default')};
`;

function PrivateCommentBottomSheet({
  entry,
  friendUsername,
  isOwner = false,
  onClose,
  onCommentAdded,
  onCommented,
}: Props) {
  const { t } = useTranslation();
  const { myProfile } = useBoundStore(UserSelector);
  const { data, mutate } = useSWR<PaginationResponse<Comment[]>>(
    `private-comments-${entry.id}`,
    () => getPrivateComments(entry.id),
  );

  const comments = data?.results ?? [];

  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!text.trim() || isSending) return;
    setIsSending(true);
    try {
      if (replyTo) {
        await postPrivateReply(replyTo.id, text.trim());
        onCommented?.();
      } else {
        await postPrivateComment(entry.id, text.trim());
        onCommentAdded();
        onCommented?.();
      }
      setText('');
      setReplyTo(null);
      await mutate();
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteComment = (commentId: number) => {
    mutate(
      (prev) =>
        prev ? { ...prev, results: (prev.results ?? []).filter((c) => c.id !== commentId) } : prev,
      false,
    );
    deleteComment(commentId);
  };

  const headerTitle = isOwner
    ? t('private_reply.owner_title')
    : t('private_reply.only_between', { username: friendUsername });

  // Owner: footer only when replying; friend: always visible
  const showFooter = !isOwner || replyTo !== null;

  // The "other" username for the hint — whoever the current user is writing to
  const otherUsername = isOwner ? replyTo?.author_detail?.username : friendUsername;

  return createPortal(
    <BottomModal
      visible
      onClose={onClose}
      customHeight={Math.round(SCREEN_HEIGHT * 0.75)}
      draggable
      containerBgColor="WHITE"
    >
      <Header>
        <SvgIcon name="private_comment" size={16} />
        <Typo type="title-medium" bold>
          {headerTitle}
        </Typo>
      </Header>

      <ScrollArea ref={scrollRef}>
        {comments.length === 0 && (
          <Layout.FlexRow w="100%" justifyContent="center" mt={24} ph={16}>
            <Typo type="body-medium" color="MEDIUM_GRAY">
              {t('private_reply.empty')}
            </Typo>
          </Layout.FlexRow>
        )}
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isPostAuthor={isOwner}
            onClickReplyBtn={(c) => setReplyTo((c as Comment | undefined) ?? comment)}
            onDeleteComplete={handleDeleteComment}
            privateThread
          />
        ))}
      </ScrollArea>

      {showFooter && (
        <FooterWrapper>
          {otherUsername && (
            <HintRow>
              <SvgIcon name="private_comment" size={13} />
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {t('private_reply.visibility_hint', { username: otherUsername })}
              </Typo>
            </HintRow>
          )}
          <InputRow>
            {myProfile && <ProfileImage imageUrl={myProfile.profile_image} size={36} />}
            <InputBox>
              {replyTo && (
                <ReplyBanner>
                  <Typo type="body-medium" color="DARK_GRAY">
                    {t('comment.replying_to', { username: replyTo.author_detail?.username })}
                  </Typo>
                  <SvgIcon name="close_comment" size={24} onClick={() => setReplyTo(null)} />
                </ReplyBanner>
              )}
              <Layout.FlexRow w="100%" alignItems="center" style={{ padding: '2px 6px 2px 10px' }}>
                <TextInput
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t('private_reply.placeholder') as string}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <PostButton
                  type="button"
                  $active={!!text.trim() && !isSending}
                  onClick={handleSend}
                  disabled={!text.trim() || isSending}
                >
                  <Typo
                    type="label-medium"
                    color={text.trim() && !isSending ? 'BLACK' : 'MEDIUM_GRAY'}
                    bold
                  >
                    {t('comment.post')}
                  </Typo>
                </PostButton>
              </Layout.FlexRow>
            </InputBox>
          </InputRow>
        </FooterWrapper>
      )}
    </BottomModal>,
    document.getElementById('modal-container') || document.body,
  );
}

export default PrivateCommentBottomSheet;
