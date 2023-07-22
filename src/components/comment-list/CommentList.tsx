import { useCallback, useState } from 'react';
import DeleteAlert from '@components/_common/alert-dialog/delete-alert/DeleteAlert';
import { Divider } from '@components/_common/divider/Divider.styled';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { Comment, MomentPost, QuestionResponse, Response } from '@models/post';
import { deleteComment } from '@utils/apis/comments';
import CommentInputBox from './comment-input-box/CommentInputBox';
import CommentItem from './comment-item/CommentItem';
import { getCommentList } from './CommentList.helper';

interface CommentListProps {
  postType: 'Moment' | 'Response';
  post: MomentPost | QuestionResponse | Response;
}

function CommentList({ postType, post }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
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

  const onClickCommentDeleteBtn = (comment: Comment) => {
    setDeleteTarget(comment);
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
    <Layout.FlexCol w="100%" pl={8} pr={8}>
      <Divider width={1} marginTrailing={10} />
      <Layout.FlexCol w="100%" gap={2}>
        {/* TODO: private comments */}
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onClickDeleteBtn={onClickCommentDeleteBtn}
            reloadComments={getComments}
          />
        ))}
      </Layout.FlexCol>
      <CommentInputBox post={post} postType={postType} reloadComments={getComments} />
      <DeleteAlert
        visible={!!deleteTarget}
        close={closeDeleteAlert}
        onClickConfirm={confirmDeleteAlert}
      />
    </Layout.FlexCol>
  );
}

export default CommentList;
