import { PaginationResponse } from '@models/api/common';
import { CheckInBase, CheckInForm, MyCheckIn } from '@models/checkIn';
import axios from './axios';

// GET check-in list
export const getCheckInList = async () => {
  const { data } = await axios.get<PaginationResponse<MyCheckIn[]>>(`/check_in/`);
  return data;
};

// POST check-in (create or edit)
export const postCheckIn = async (checkIn: CheckInForm) => {
  const { data } = await axios.post<MyCheckIn>(`/check_in/`, checkIn);
  return data;
};

// GET check-in detail
export const getCheckInDetail = async (checkInId: number) => {
  const { data } = await axios.get<MyCheckIn>(`/check_in/${checkInId}/`);
  return data;
};

// TODO: 나중에 삭제 UI 구현하면 적용
// DELETE check-in
export const deleteCheckIn = async () => {
  await axios.delete(`/check_in/`);
};

// PATCH read friend check-in
export const readFriendCheckIn = async (checkInId: number) => {
  await axios.patch<CheckInBase>(`/check_in/read/${checkInId}/`);
};

// POST toggle reaction on a check-in (creates or removes)
export const toggleCheckInReaction = async (checkInId: number, emoji: string) => {
  const { data } = await axios.post<{ toggled: 'on' | 'off'; id?: number; emoji?: string }>(
    `/check_in/${checkInId}/react/`,
    { emoji },
  );
  return data;
};

// GET reactions for a check-in
export const getCheckInReactions = async (checkInId: number) => {
  const { data } = await axios.get<
    { id: number; emoji: string; user: { id: number; username: string } }[]
  >(`/check_in/${checkInId}/reactions/`);
  return data;
};
