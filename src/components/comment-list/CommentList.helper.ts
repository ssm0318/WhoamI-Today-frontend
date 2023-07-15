import { getCommentsOfMoment } from '@utils/apis/moment';
import { getCommentsOfResponse } from '@utils/apis/responses';

export const getCommentList = async (postType: 'Moment' | 'Response', postId: number) => {
  switch (postType) {
    case 'Moment':
      return getCommentsOfMoment(postId);
    case 'Response':
      return getCommentsOfResponse(postId);
    default:
      return [];
  }
};
