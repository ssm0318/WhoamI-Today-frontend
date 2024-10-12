import { useState } from 'react';
import { Comment, PrivateComment } from '@models/post';
import { deleteComment } from '@utils/apis/comments';

interface Params {
  onDeleteComplete: (commentId: number) => void;
}

const useDeleteCommentAlert = ({ onDeleteComplete }: Params) => {
  const [deleteTarget, setDeleteTarget] = useState<Comment | PrivateComment>();

  const closeDeleteAlert = () => {
    setDeleteTarget(undefined);
  };

  const confirmDeleteAlert = () => {
    if (!deleteTarget?.id) return;

    deleteComment(deleteTarget.id)
      .then(() => {
        if (!deleteTarget?.id) return;
        onDeleteComplete(deleteTarget.id);
      })
      .catch(() => {
        // TODO
      })
      .finally(() => closeDeleteAlert());
    closeDeleteAlert();
  };

  return { setDeleteTarget, deleteTarget, closeDeleteAlert, confirmDeleteAlert };
};

export default useDeleteCommentAlert;
