import { PaginationResponse } from '@models/api/common';
import { InputPingMessage, PingMessage, PingRoom, PostPingMessageRes } from '@models/ping';
import axios from '@utils/apis/axios';

export const getPingRooms = async (next?: string | null) => {
  const requestPage = next ? next.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<PingRoom[]>>(
    `/ping/rooms/${requestPage ? `?page=${requestPage}` : ''}`,
  );
  return data;
};

export const getPings = async (userId: number, page?: string | null) => {
  const requestPage = page ? page.split('page=')[1] : 1;

  const { data } = await axios.get<PaginationResponse<PingMessage[]>>(
    `/ping/user/${userId}/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};

export const postPingMessage = async (userId: number, inputPinMsg: InputPingMessage) => {
  return axios.post<PostPingMessageRes>(`/ping/user/${userId}/`, inputPinMsg);
};
