import { ChatMessage, ChatRoom } from '@models/api/chat';
import { PaginationResponse } from '@models/api/common';
import axios from './axios';

export const getChatRooms = async () => {
  const { data } = await axios.get<PaginationResponse<ChatRoom[]>>(`/chat/rooms/`);
  return data?.results || [];
};

export const getChatMessages = async (roomId: string) => {
  const { data } = await axios.get<PaginationResponse<ChatMessage[]>>(`/chat/${roomId}/messages/`);
  return data?.results || [[]];
};
