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

  // TODO: pagination 적용 시, 댓/답글 삭제에 따라 nextPage 업데이트가 필요함
  // 혹은 현재 댓글 작성처럼, 삭제된 페이지를 다시 불러오고 이후 페이지는 나중에 다시 불러오는 방식?
  const deleteComment = (commentId: number) => {
    // 삭제 대상이 댓글인 경우
    const targetComment = comments.findIndex(({ id }) => id === commentId);
    if (targetComment !== -1) {
      setComments((prev) => [...prev.slice(0, targetComment), ...prev.slice(targetComment + 1)]);
      return;
    }

    // 삭제 대상이 답글인 경우
    const targetCommentOfReply = comments.findIndex(({ replies }) =>
      replies.some(({ id }) => id === commentId),
    );

    if (targetCommentOfReply === -1) return;

    setComments((prev) => [
      ...prev.slice(0, targetCommentOfReply),
      {
        ...prev[targetCommentOfReply],
        replies: [...prev[targetCommentOfReply].replies.filter(({ id }) => id !== commentId)],
      },
      ...prev.slice(targetCommentOfReply + 1),
    ]);
  };

  return { comments, fetchComments, nextPage, deleteComment };
};

export default useCommentList;
