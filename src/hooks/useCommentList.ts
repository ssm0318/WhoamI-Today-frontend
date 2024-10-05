import { useState } from 'react';
import { getCommentList } from '@components/comment-list/CommentList.helper';
import { Comment, Note, Response } from '@models/post';
import useAsyncEffect from './useAsyncEffect';

const useCommentList = (post: Response | Note, setIsLoading?: (isLoading: boolean) => void) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);

  const fetchComments = async (page: string | null, update: boolean) => {
    const { results, next } = await getCommentList(post.type, post.id, page);
    if (!results) return;
    setNextPage(next);
    if (update) setComments(results);
    else setComments([...comments, ...results]);
    setIsLoading?.(false);
  };

  useAsyncEffect(async () => {
    if (nextPage !== null) {
      await fetchComments(nextPage ?? null, false);
    }
  }, [nextPage]);

  const deleteComment = async (commentId: number) => {
    // 삭제 대상이 댓글인 경우
    const targetCommentIndex = comments.findIndex(({ id }) => id === commentId);

    if (targetCommentIndex !== -1) {
      const updatedComments = [
        ...comments.slice(0, targetCommentIndex),
        ...comments.slice(targetCommentIndex + 1),
      ];
      setComments(updatedComments);
    } else {
      // 삭제 대상이 대댓글인 경우
      const targetCommentOfReplyIndex = comments.findIndex(({ replies }) =>
        replies.some(({ id }) => id === commentId),
      );

      if (targetCommentOfReplyIndex !== -1) {
        const updatedReplies = comments[targetCommentOfReplyIndex].replies.filter(
          ({ id }) => id !== commentId,
        );
        const updatedComments = [
          ...comments.slice(0, targetCommentOfReplyIndex),
          {
            ...comments[targetCommentOfReplyIndex],
            replies: updatedReplies,
          },
          ...comments.slice(targetCommentOfReplyIndex + 1),
        ];
        setComments(updatedComments);
      }
    }

    // Re-fetch the current page to update nextPage
    setIsLoading?.(true);
    await fetchComments(null, true);
  };

  return { comments, fetchComments, nextPage, deleteComment };
};

export default useCommentList;
