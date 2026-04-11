import { PaginationResponse } from '@models/api/common';
import { ChatMessage, ChatRoom, InputChatMessage, PostChatMessageRes } from '@models/chat';
import axios, { axiosFormDataInstance } from '@utils/apis/axios';

export const getChatRooms = async (next?: string | null) => {
  const requestPage = next ? next.split('page=')[1] : null;
  const { data } = await axios.get<PaginationResponse<ChatRoom[]>>(
    `/chat/rooms/${requestPage ? `?page=${requestPage}` : ''}`,
  );
  return data;
};

export const getChatMessages = async (userId: number, page?: string | null) => {
  const requestPage = page ? page.split('page=')[1] : 1;
  const { data } = await axios.get<PaginationResponse<ChatMessage[]>>(
    `/chat/user/${userId}/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};

export const postChatMessage = async (userId: number, msg: InputChatMessage, image?: File) => {
  if (image) {
    const formData = new FormData();
    formData.append('image', image);
    if (msg.content) formData.append('content', msg.content);
    if (msg.parent) formData.append('parent', String(msg.parent));
    return axiosFormDataInstance.post<PostChatMessageRes>(`/chat/user/${userId}/`, formData);
  }
  return axios.post<PostChatMessageRes>(`/chat/user/${userId}/`, msg);
};

export const addMessageReaction = async (messageId: number, emoji: string) => {
  return axios.post(`/chat/${messageId}/reactions/`, { emoji });
};

export const removeMessageReaction = async (reactionId: number) => {
  return axios.delete(`/chat/reactions/${reactionId}/`);
};

export const markMessagesRead = async (userId: number) => {
  return axios.post(`/chat/user/${userId}/mark-read/`);
};

export const markGroupMessagesRead = async (roomId: number) => {
  return axios.post(`/chat/groups/${roomId}/mark-read/`);
};

export const searchMessages = async (query: string) => {
  const { data } = await axios.get<ChatMessage[]>(`/chat/search/?q=${encodeURIComponent(query)}`);
  return data;
};

// Group chat APIs
export const createGroupChat = async (name: string, memberIds: number[]) => {
  const { data } = await axios.post<ChatRoom>('/chat/groups/', {
    name,
    member_ids: memberIds,
  });
  return data;
};

export const updateGroupChat = async (
  roomId: number,
  updates: { name?: string; add_member_ids?: number[]; remove_member_ids?: number[] },
) => {
  const { data } = await axios.patch<ChatRoom>(`/chat/groups/${roomId}/`, updates);
  return data;
};

export const leaveGroupChat = async (roomId: number) => {
  return axios.post(`/chat/groups/${roomId}/leave/`);
};

export const getGroupMessages = async (roomId: number, page?: string | null) => {
  const requestPage = page ? page.split('page=')[1] : 1;
  const { data } = await axios.get<PaginationResponse<ChatMessage[]>>(
    `/chat/groups/${roomId}/messages/${!requestPage ? '' : `?page=${requestPage}`}`,
  );
  return data;
};

export const postGroupMessage = async (roomId: number, msg: InputChatMessage, image?: File) => {
  if (image) {
    const formData = new FormData();
    formData.append('image', image);
    if (msg.content) formData.append('content', msg.content);
    if (msg.parent) formData.append('parent', String(msg.parent));
    return axiosFormDataInstance.post<PostChatMessageRes>(
      `/chat/groups/${roomId}/messages/`,
      formData,
    );
  }
  return axios.post<PostChatMessageRes>(`/chat/groups/${roomId}/messages/`, msg);
};
