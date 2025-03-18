import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Loader from '@components/_common/loader/Loader';
import { SwipeLayoutList } from '@components/_common/swipe-layout/SwipeLayoutList';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { MAIN_SCROLL_CONTAINER_ID } from '@constants/scroll';
import { Layout } from '@design-system';
import useCommentList from '@hooks/useCommentList';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { Comment, Note, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import CommentInputBox from './comment-input-box/CommentInputBox';
import CommentItem from './comment-item/CommentItem';
import { StyledCommentListFooter } from './CommentList.styled';

interface CommentListProps {
  postType: 'Response' | 'Note';
  post: Response | Note;
  inputFocus: boolean;
  setInputFocus: Dispatch<SetStateAction<boolean>>;
  setReload: (reload: boolean) => void;
}

function CommentList({ postType, post, inputFocus, setInputFocus, setReload }: CommentListProps) {
  const footerRef = useRef<HTMLDivElement>(null);
  const { featureFlags } = useBoundStore(UserSelector);

  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const [commentTo, setCommentTo] = useState<Response | Note | Comment>(post);
  const [commentToType, setCommentToType] = useState<'Response' | 'Note' | 'Comment'>(postType);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollToBottom, setIsScrollToBottom] = useState<boolean>(false);

  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchComments(nextPage ?? null, false);
  });

  const { comments, fetchComments, nextPage, deleteComment } = useCommentList(post, setIsLoading);

  useEffect(() => {
    if (isScrollToBottom && !replyTo) {
      const scrollEl = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
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

  return (
    <Layout.FlexCol ref={scrollRef} w="100%" pt={24}>
      <Layout.FlexCol w="100%" h="100%" gap={2} ph={16} mb={footerRef.current?.offsetHeight}>
        <SwipeLayoutList>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              isPostAuthor={myProfile?.id === post.author_detail.id}
              comment={comment}
              onClickReplyBtn={() => {
                setInputFocus(true);
                setReplyTo(comment);
                if (featureFlags?.friendList) {
                  setIsPrivate(comment.is_private);
                }
                setCommentTo(comment);
                setCommentToType('Comment');
              }}
              onDeleteComplete={deleteComment}
            />
          ))}
        </SwipeLayoutList>
      </Layout.FlexCol>
      <StyledCommentListFooter ref={footerRef} b={BOTTOM_TABBAR_HEIGHT} w="100%" bgColor="WHITE">
        <Layout.FlexRow w="100%">
          <CommentInputBox
            post={commentTo}
            postType={commentToType}
            inputFocus={inputFocus}
            setInputFocus={setInputFocus}
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
            setReload={setReload}
          />
        </Layout.FlexRow>
      </StyledCommentListFooter>
      <div ref={targetRef} />
      {isLoading && (
        <Layout.FlexRow w="100%" h={40}>
          <Loader />
        </Layout.FlexRow>
      )}
    </Layout.FlexCol>
  );
}

export default CommentList;
