import { PaginationResponse } from '@models/api/common';
import { DiscoverFilter, DiscoverResultItem } from '@models/discover';
import axios from './axios';

export const getDiscoverFeed = async (page: string | null, filters?: DiscoverFilter[]) => {
  const requestPage = page ? page.split('page=')[1] : null;
  const params = new URLSearchParams();

  if (requestPage) {
    params.append('page', requestPage);
  }

  if (filters && filters.length > 0) {
    params.append('filter', filters.join(','));
  }

  const queryString = params.toString();
  const { data } = await axios.get<PaginationResponse<DiscoverResultItem[]>>(
    `/user/discover/${queryString ? `?${queryString}` : ''}`,
  );

  return data;
};
