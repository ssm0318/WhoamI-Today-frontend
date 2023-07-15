export interface Response<T> {
  count: number;
  detail?: string;
  results?: T;
}

export interface PaginationResponse<T> extends Response<T> {
  next: string | null;
  previous: string | null;
}

export interface DateRequestParams {
  year: number;
  month: number;
  day: number;
}

export interface CommonTarget {
  target_type: 'Moment' | 'Response' | 'Comment';
  target_id: number;
}
