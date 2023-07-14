import axios from './axios';

interface LikeTargetInfo {
  target_type: 'Moment' | 'Response' | 'Comment';
  target_id: number;
}

export const postLike = async (targetInfo: LikeTargetInfo) => {
  return axios.post(`/likes/`, targetInfo);
};

export const deleteLike = async (targetInfo: LikeTargetInfo) => {
  return axios.delete(`/likes/${targetInfo.target_id}/`);
};
