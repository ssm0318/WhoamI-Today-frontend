import { ChatMessage, ChatRoom } from '@models/api/chat';
import { PaginationResponse } from '@models/api/common';
import axios from './axios';

export const getChatRooms = async (next?: string | null) => {
  const requestPage = next ? next.split('page=')[1] : null;

  const { data } = await axios.get<PaginationResponse<ChatRoom[]>>(
    `/chat/rooms/${requestPage ? `?page=${requestPage}` : ''}`,
  );
  return data;
};

export const getChatMessages = async (roomId: string | number, next?: string | null) => {
  const requestPage = next ? next.split('page=')[1] : null;

  const { data } = await axios.get<PaginationResponse<ChatMessage[]>>(
    `/chat/${roomId}/messages/${requestPage ? `?page=${requestPage}` : ''}`,
  );
  return data;
};

export const getChatRoomIdByUserId = async (userId: number) => {
  const { data } = await axios.get<{ chat_room_id?: number }>(`/chat/rooms/one_on_one/${userId}/`);
  return data.chat_room_id;
};
