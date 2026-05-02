import { PaginationResponse } from '@models/api/common';
import { NoteFeedItem } from '@models/post';
import axios from '@utils/apis/axios';

export const getAllFeed = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;

  const { data } = await axios.get<PaginationResponse<NoteFeedItem[]>>(
    `/user/feed/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};
