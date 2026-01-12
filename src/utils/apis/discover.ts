import { PaginationResponse } from '@models/api/common';
import { DiscoverResultItem } from '@models/discover';
import axios from './axios';

export const getDiscoverFeed = async (page: string | null) => {
  const requestPage = page ? page.split('page=')[1] : null;

  const { data } = await axios.get<PaginationResponse<DiscoverResultItem[]>>(
    `/user/discover/${!requestPage ? '' : `?page=${requestPage}`}`,
  );

  return data;
};
