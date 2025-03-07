import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Divider from '@components/_common/divider/Divider';
import Icon from '@components/_common/icon/Icon';
import CommentInputBox from '@components/comment-list/comment-input-box/CommentInputBox';
import CommentItem from '@components/comment-list/comment-item/CommentItem';
import { Layout, Typo } from '@design-system';
import useCommentList from '@hooks/useCommentList';
import { Comment, Note, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import {
  CommentBottomContentWrapper,
  CommentBottomFooterWrapper,
  CommentBottomHeaderWrapper,
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
  const { featureFlags } = useBoundStore(UserSelector);

  const { comments, fetchComments, nextPage, deleteComment } = useCommentList(post);

  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const [commentTo, setCommentTo] = useState<Response | Note | Comment>(post);
  const [commentToType, setCommentToType] = useState<'Response' | 'Note' | 'Comment'>(postType);

  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  const handleClick = () => {
    closeBottomSheet();
  };

  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState<number>();

  useEffect(() => {
    setFooterHeight(footerRef.current?.offsetHeight);
  }, [replyTo]);

  return createPortal(
    <BottomModal visible={visible} onClose={closeBottomSheet} heightMode="full">
      <CommentBottomHeaderWrapper>
        <Layout.FlexRow w="100%" justifyContent="center">
          <Icon name="home_indicator" />
        </Layout.FlexRow>
        <Layout.FlexRow w="100%" h="100%">
          <Layout.FlexRow onClick={handleClick} pl={20}>
            <Typo type="title-large">{t('cancel')}</Typo>
          </Layout.FlexRow>
          <Layout.FlexRow
            style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
          >
            <Typo type="title-large">{t('comment')}</Typo>
          </Layout.FlexRow>
        </Layout.FlexRow>
        <Layout.FlexCol gap={12} pt={12} w="100%">
          <Divider width={1} />
        </Layout.FlexCol>
      </CommentBottomHeaderWrapper>

      <CommentBottomContentWrapper mb={footerHeight}>
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
          />
        ))}
      </CommentBottomContentWrapper>

      <CommentBottomFooterWrapper ref={footerRef}>
        <CommentInputBox
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
          reloadComments={() => fetchComments(nextPage ?? null, true)}
        />
      </CommentBottomFooterWrapper>
    </BottomModal>,
    document.getElementById('root-container') || document.body,
  );
}

export default CommentBottomSheet;
