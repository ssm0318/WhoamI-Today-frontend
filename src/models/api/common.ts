import { AxiosError } from 'axios';

export interface Response<T> {
  count: number;
  detail?: string;
  results?: T;
}

export interface PaginationResponse<T> extends Response<T> {
  next: string | null;
  previous: string | null;
  oldest_unread_page?: number;
  username?: string;
}

export interface DateRequestParams {
  year: number;
  month: number;
  day: number;
}

export interface CommonTarget {
  target_type: 'Moment' | 'Response' | 'Comment' | 'Note' | 'PrivateComment';
  target_id: number;
}

export type FetchState<T> =
  | {
      state: 'loading';
      data?: T;
    }
  | {
      state: 'hasValue';
      data: T;
    }
  | {
      state: 'hasError';
      data?: undefined;
      error?: AxiosError;
    };
