import { useCallback, useState } from 'react';
import DeleteAlert from '@components/_common/alert-dialog/delete-alert/DeleteAlert';
import { Divider } from '@components/_common/divider/Divider.styled';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { Comment, QuestionResponse, Response } from '@models/post';
import { deleteComment } from '@utils/apis/comments';
import CommentInputBox from './comment-input-box/CommentInputBox';
import CommentItem from './comment-item/CommentItem';
import { getCommentList } from './CommentList.helper';

interface CommentListProps {
  postType: 'Response';
  post: QuestionResponse | Response;
}

function CommentList({ postType, post }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const getComments = useCallback(async () => {
    const commentList = await getCommentList(postType, post.id);
    // TODO: comment pagination 추가
    setComments(commentList.flat());
  }, [post.id, postType]);
  useAsyncEffect(getComments, [getComments]);

  const [deleteTarget, setDeleteTarget] = useState<Comment>();

  const closeDeleteAlert = () => {
    setDeleteTarget(undefined);
  };

  const confirmDeleteAlert = () => {
    if (!deleteTarget) return;
    deleteComment(deleteTarget.id)
      .then(() => getComments())
      .catch(() => console.log('TODO: 삭제 실패 알림'))
      .finally(() => closeDeleteAlert());
    closeDeleteAlert();
  };

  return (
    <Layout.FlexCol w="100%" ph={8}>
      <Divider width={1} marginTrailing={10} />
      <Layout.FlexCol w="100%" gap={2}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onClickReplyBtn={() => setReplyTo(comment)}
          />
        ))}
      </Layout.FlexCol>
      <CommentInputBox
        post={post}
        postType={postType}
        reloadComments={getComments}
        replyTo={replyTo}
      />
      <DeleteAlert
        visible={!!deleteTarget}
        close={closeDeleteAlert}
        onClickConfirm={confirmDeleteAlert}
      />
    </Layout.FlexCol>
  );
}

export default CommentList;
