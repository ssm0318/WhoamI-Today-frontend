import { Dispatch, SetStateAction, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModalWithInput from '@components/_common/bottom-modal-with-input/BottomModalWithInput';
import CommentInputBox from '@components/comment-list/comment-input-box/CommentInputBox';
import CommentItem from '@components/comment-list/comment-item/CommentItem';
import { Layout, Typo } from '@design-system';
import useCommentList from '@hooks/useCommentList';
import { Comment, Note, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import {
  CommentBottomContentWrapper,
  CommentBottomFooterWrapper,
  CommentBottomHeaderWrapper,
  CommentBottomTitleWrapper,
} from './CommentBottomSheet.styled';

interface Props {
  postType: 'Response' | 'Note';
  post: Response | Note;
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

  const { comments, fetchComments, nextPage, deleteComment } = useCommentList(post);

  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const [commentTo, setCommentTo] = useState<Response | Note | Comment>(post);
  const [commentToType, setCommentToType] = useState<'Response' | 'Note' | 'Comment'>(postType);

  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  const handleClick = () => {
    closeBottomSheet();
  };

  return createPortal(
    <BottomModalWithInput visible={visible} onClose={closeBottomSheet} heightMode="full">
      <CommentBottomHeaderWrapper>
        <Layout.FlexRow>
          <Layout.FlexRow onClick={handleClick} pl={20}>
            <Typo type="title-large">{t('cancel')}</Typo>
          </Layout.FlexRow>
          <CommentBottomTitleWrapper>
            <Typo type="title-large">{t('comment')}</Typo>
          </CommentBottomTitleWrapper>
        </Layout.FlexRow>
      </CommentBottomHeaderWrapper>
      <CommentBottomContentWrapper>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            isPostAuthor={myProfile?.id === post.author_detail.id}
            comment={comment}
            onClickReplyBtn={() => {
              setInputFocus(true);
              setReplyTo(comment);
              setIsPrivate(comment.is_private);
              setCommentTo(comment);
              setCommentToType('Comment');
            }}
            onDeleteComplete={deleteComment}
          />
        ))}
      </CommentBottomContentWrapper>
      <CommentBottomFooterWrapper>
        <CommentInputBox
          post={commentTo}
          postType={commentToType}
          inputFocus={inputFocus}
          setInputFocus={setInputFocus}
          inputFocusDuration={BOTTOM_MODAL_ANIMATION_DURATION}
          isPrivate={isPrivate}
          setIsPrivate={() => {
            setIsPrivate((prev) => !prev);
          }}
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
          reloadComments={() => fetchComments(nextPage ?? null, true)}
        />
      </CommentBottomFooterWrapper>
    </BottomModalWithInput>,
    document.getElementById('root-container') || document.body,
  );
}

export default CommentBottomSheet;
