import { useRef, useState } from 'react';
import DeleteAlert from '@components/_common/alert-dialog/delete-alert/DeleteAlert';
import Loader from '@components/_common/loader/Loader';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { Comment, Note, Response } from '@models/post';
import { deleteComment } from '@utils/apis/comments';
import CommentInputBox from './comment-input-box/CommentInputBox';
import CommentItem from './comment-item/CommentItem';
import { getCommentList } from './CommentList.helper';
import { StyledCommentListFooter } from './CommentList.styled';

interface CommentListProps {
  postType: 'Response' | 'Note';
  post: Response | Note;
}

function CommentList({ postType, post }: CommentListProps) {
  const footerRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchComments(nextPage ?? null);
  });

  const fetchComments = async (page: string | null) => {
    const { results, next } = await getCommentList(postType, post.id ?? 0, page);
    if (!results) return;
    setNextPage(next);
    setComments([...comments, ...results]);
    setIsLoading(false);
  };

  const [deleteTarget, setDeleteTarget] = useState<Comment>();

  const closeDeleteAlert = () => {
    setDeleteTarget(undefined);
  };

  const confirmDeleteAlert = () => {
    if (!deleteTarget) return;
    deleteComment(deleteTarget.id ?? 0)
      .then(() => fetchComments(null))
      .catch(() => console.log('TODO: 삭제 실패 알림'))
      .finally(() => closeDeleteAlert());
    closeDeleteAlert();
  };

  return (
    <Layout.FlexCol w="100%" h="100%" pt={24}>
      <Layout.FlexCol w="100%" gap={2} ph={16} mb={footerRef.current?.offsetHeight}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onClickReplyBtn={() => {
              setReplyTo(comment);
              setIsPrivate(comment.is_private);
            }}
          />
        ))}
      </Layout.FlexCol>
      <StyledCommentListFooter ref={footerRef} b={0} w="100%" bgColor="WHITE">
        <Layout.FlexRow w="100%">
          <CommentInputBox
            post={post}
            postType={postType}
            isPrivate={isPrivate}
            setIsPrivate={() => {
              setIsPrivate((prev) => !prev);
            }}
            isReply={!!replyTo}
            replyTo={replyTo}
            resetReplyTo={() => {
              setReplyTo(null);
            }}
          />
        </Layout.FlexRow>
      </StyledCommentListFooter>
      <DeleteAlert
        visible={!!deleteTarget}
        close={closeDeleteAlert}
        onClickConfirm={confirmDeleteAlert}
      />
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
