import { DateRequestParams } from '@models/api/common';
import { DayQuestion } from '@models/post';
import axios from './axios';

export const getDayQuestions = async ({ year, month, day }: DateRequestParams) => {
  const { data } = await axios.get<DayQuestion[]>(`/feed/responses/${year}/${month}/${day}/`);
  return data;
};

export const deleteResponse = async (responseId: number) => {
  return axios.delete(`/feed/responses/${responseId}/`);
};
