import { useCallback, useState } from 'react';
import DeleteAlert from '@components/_common/alert-dialog/delete-alert/DeleteAlert';
import { Divider } from '@components/_common/divider/Divider.styled';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { Comment, MomentPost, QuestionResponse } from '@models/post';
import CommentInputBox from './comment-input-box/CommentInputBox';
import CommentItem from './comment-item/CommentItem';
import { getCommentList } from './CommentList.helper';

interface CommentListProps {
  postType: 'Moment' | 'Response';
  post: MomentPost | QuestionResponse;
}

function CommentList({ postType, post }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const getComments = useCallback(async () => {
    const commentList = await getCommentList(postType, post.id);
    setComments(commentList);
  }, [post.id, postType]);
  useAsyncEffect(getComments, [getComments]);

  const [deleteTarget, setDeleteTarget] = useState<Comment>();

  const closeDeleteAlert = () => {
    setDeleteTarget(undefined);
  };

  const onClickCommentDeleteBtn = (comment: Comment) => {
    setDeleteTarget(comment);
  };

  const deleteComment = () => {
    if (!deleteTarget) return;
    console.log(`TODO: delete ${postType} comment ${deleteTarget.id}`);
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
          />
        ))}
      </Layout.FlexCol>
      <CommentInputBox />
      <DeleteAlert
        visible={!!deleteTarget}
        close={closeDeleteAlert}
        onClickConfirm={deleteComment}
      />
    </Layout.FlexCol>
  );
}

export default CommentList;
