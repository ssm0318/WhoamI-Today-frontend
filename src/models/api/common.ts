export interface Response<T> {
  count: number;
  detail?: string;
  results?: T;
}

export interface PaginationResponse<T> extends Response<T> {
  next: string | null;
  previous: string | null;
}
