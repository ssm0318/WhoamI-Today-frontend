import { PaginationResponse } from '@models/api/common';
import { Comment } from '@models/post'; // Import the 'Comment' type from the correct location
import { getNoteComments } from '@utils/apis/note';
import { getCommentsOfResponse } from '@utils/apis/responses';

export const getCommentList = async (
  postType: 'Response' | 'Note',
  postId: number,
  page: string | null,
): Promise<PaginationResponse<Comment[]>> => {
  switch (postType) {
    case 'Response':
      return getCommentsOfResponse(postId, page);
    case 'Note':
      return getNoteComments(postId, page);
    default:
      return { results: [], next: null, previous: null, count: 0 };
  }
};
