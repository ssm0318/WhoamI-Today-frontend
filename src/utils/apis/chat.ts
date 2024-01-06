import { PaginationResponse } from '@models/api/common';
import axios from './axios';

export const getChatRooms = async () => {
  const { data } = await axios.get<PaginationResponse<any[]>>(`/chat/rooms/`);
  return data?.results || [];
};

export const getChatMessages = async (roomId: string) => {
  const { data } = await axios.get<PaginationResponse<any[]>>(`/chat/${roomId}/messages/`);
  return data?.results || [[]];
};
