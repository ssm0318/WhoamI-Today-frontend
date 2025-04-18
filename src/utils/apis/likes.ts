import i18n from '@i18n/index';
import { CommonTarget } from '@models/api/common';
import axios from './axios';

interface PostLikeResponse extends CommonTarget {
  id: number;
  type: 'Like';
  user: string;
  user_detail: { id: number; username: string };
  is_anonymous: boolean;
}

export const postLike = async (targetInfo: CommonTarget, onError: (errorMsg: string) => void) => {
  const { data } = await axios.post<PostLikeResponse>(`/likes/`, targetInfo).catch((e) => {
    if (e.response?.data.detail) {
      onError(e.response.data.detail);
    } else {
      onError(i18n.t('error.temporary_error'));
    }
    throw e;
  });
  return data;
};

export const deleteLike = async (likeId: number, onError: (errorMsg: string) => void) => {
  return axios.delete(`/likes/${likeId}/`).catch((e) => {
    if (e.response?.data.detail) {
      onError(e.response.data.detail);
    } else {
      onError(i18n.t('error.temporary_error'));
    }
  });
};
