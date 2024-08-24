import { ContentsCommon } from '@models/post';

export const isUpdated = (
  created_at: ContentsCommon['created_at'],
  updated_at: ContentsCommon['updated_at'],
) => created_at.split('.')[0] !== updated_at.split('.')[0];
