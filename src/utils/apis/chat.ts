import { ChatMessage, ChatRoom } from '@models/api/chat';
import { PaginationResponse } from '@models/api/common';
import axios from './axios';

export const getChatRooms = async () => {
  const { data } = await axios.get<PaginationResponse<ChatRoom[]>>(`/chat/rooms/`);
  return data?.results || [];
};

export const getChatMessages = async (roomId: string | number, next?: string | null) => {
  const requestPage = next ? next.split('page=')[1] : null;

  const { data } = await axios.get<PaginationResponse<ChatMessage[]>>(
    `/chat/${roomId}/messages/${requestPage ? `?page=${requestPage}` : ''}`,
  );
  return data;
};
