export interface Response<T> {
  count: number;
  detail?: string;
  results?: T;
}
