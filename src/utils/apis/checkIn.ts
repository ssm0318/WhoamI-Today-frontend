import axios from 'axios';
import { PaginationResponse } from '@models/api/common';
import { CheckInBase, CheckInForm, MyCheckIn } from '@models/checkIn';

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

// DELETE check-in
export const deleteCheckIn = async () => {
  await axios.delete(`/check_in/`);
};

// PATCH read friend check-in
export const readFriendCheckIn = async (friendId: number) => {
  await axios.patch<CheckInBase>(`/check_in/read/${friendId}/`);
};
