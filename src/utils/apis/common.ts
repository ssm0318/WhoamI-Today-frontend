import { DateRequestParams } from '@models/api/common';
import axios from './axios';

export const getDateRequestParams = (date: Date): DateRequestParams => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return { year, month, day };
};

export const reportContent = async (postId: number, postType: 'note' | 'response') => {
  await axios.post('/content_reports/', { target_id: postId, target_type: postType });
};
