import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import CommentInputBox from '@components/comment-list/comment-input-box/CommentInputBox';
import CommentItem from '@components/comment-list/comment-item/CommentItem';
import { SCREEN_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useCommentList from '@hooks/useCommentList';
import { CheckInPost } from '@models/checkInPost';
import { Comment, Note, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';

import {
  CommentBottomContentWrapper,
  CommentBottomFooterWrapper,
} from './CommentBottomSheet.styled';

interface Props {
  postType: 'Response' | 'Note' | 'CheckInPost';
  post: Response | Note | CheckInPost;
  visible: boolean;
  inputFocus: boolean;
  setInputFocus: Dispatch<SetStateAction<boolean>>;
  closeBottomSheet: () => void;
}

const BOTTOM_MODAL_ANIMATION_DURATION = 300;

function CommentBottomSheet({
  postType,
  post,
  visible,
  inputFocus,
  setInputFocus,
  closeBottomSheet,
}: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });
  const { featureFlags } = useBoundStore(UserSelector);

  const { comments, fetchComments, nextPage, deleteComment } = useCommentList(post);

  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const [commentTo, setCommentTo] = useState<Response | Note | Comment | CheckInPost>(post);
  const [commentToType, setCommentToType] = useState<
    'Response' | 'Note' | 'Comment' | 'CheckInPost'
  >(postType);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollToBottom, setIsScrollToBottom] = useState<boolean>(false);

  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState<number>();

  useEffect(() => {
    setFooterHeight(footerRef.current?.offsetHeight);
  }, [replyTo]);

  useEffect(() => {
    if (isScrollToBottom && !replyTo) {
      const scrollEl = scrollRef?.current;
      if (!scrollEl) return;

      const observer = new MutationObserver(() => {
        requestAnimationFrame(() => {
          scrollEl.scrollTop = scrollEl.scrollHeight;
        });
      });

      observer.observe(scrollEl, { childList: true, subtree: true });

      return () => observer.disconnect();
    }
    setIsScrollToBottom(false);
  }, [isScrollToBottom, replyTo]);

  return createPortal(
    <BottomModal
      visible={visible}
      onClose={closeBottomSheet}
      customHeight={Math.round(SCREEN_HEIGHT * 0.75)}
      draggable
    >
      <div style={{ width: '100%', backgroundColor: '#FCFCFC', borderBottom: '1px solid #F0F0F0' }}>
        <Layout.FlexRow w="100%" h={44} alignItems="center" justifyContent="center">
          <Typo type="title-medium" bold>
            {t('comment')}
          </Typo>
        </Layout.FlexRow>
      </div>

      <CommentBottomContentWrapper mb={footerHeight} ref={scrollRef}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            isPostAuthor={myProfile?.id === post.author_detail.id}
            comment={comment}
            onClickReplyBtn={() => {
              setInputFocus(true);
              setReplyTo(comment);
              if (featureFlags?.friendList) {
                setIsPrivate?.(comment.is_private);
              }
              setCommentTo(comment);
              setCommentToType('Comment');
            }}
            onDeleteComplete={deleteComment}
            onConfirmReport={deleteComment}
          />
        ))}
      </CommentBottomContentWrapper>

      <CommentBottomFooterWrapper ref={footerRef}>
        <CommentInputBox
          from="COMMENT_BOTTOM_SHEET"
          post={commentTo}
          postType={commentToType}
          inputFocus={inputFocus}
          setInputFocus={setInputFocus}
          inputFocusDuration={BOTTOM_MODAL_ANIMATION_DURATION}
          {...(featureFlags?.friendList && {
            isPrivate,
            setIsPrivate: () => setIsPrivate((prev) => !prev),
          })}
          isReply={!!replyTo}
          replyTo={replyTo}
          resetReplyTo={() => {
            setReplyTo(null);
          }}
          resetCommentTo={() => {
            setCommentTo(post);
          }}
          resetCommentType={() => {
            setCommentToType(postType);
          }}
          reloadComments={() => {
            fetchComments(nextPage ?? null, true);
            if (!replyTo) setIsScrollToBottom(true);
          }}
        />
      </CommentBottomFooterWrapper>
    </BottomModal>,
    document.getElementById('modal-container') || document.body,
  );
}

export default CommentBottomSheet;
