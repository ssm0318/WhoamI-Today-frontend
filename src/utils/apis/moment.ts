import { Response } from '@models/api/common';
import {
  GetMomentResponse,
  MomentRequestParams,
  PostMomentRequest,
  UpdateMomentRequest,
} from '@models/api/moment';
import axios from './axios';

// GET today's moment
export const getTodayMoment = async ({ year, month, day }: MomentRequestParams) => {
  const { data } = await axios.get<GetMomentResponse>(`/moment/daily/${year}/${month}/${day}`);
  return data;
};

// POST today's moment
export const postTodayMoment = async ({ year, month, day, moment }: PostMomentRequest) => {
  const { data } = await axios.post<GetMomentResponse>(
    `/moment/today/${year}/${month}/${day}`,
    moment,
  );
  return data;
};

// PUT today's moment
export const updateTodayMoment = async ({ year, month, day, moment }: UpdateMomentRequest) => {
  const { data } = await axios.put<GetMomentResponse>(
    `/moment/today/${year}/${month}/${day}`,
    moment,
  );
  return data;
};

export const getWeeklyMoments = async ({ year, month, day }: MomentRequestParams) => {
  const { data } = await axios.get<Response<GetMomentResponse[]>>(
    `/moment/weekly/${year}/${month}/${day}`,
  );
  return data?.results || [];
};

export const getMonthlyMoments = async ({ year, month }: Omit<MomentRequestParams, 'day'>) => {
  const { data } = await axios.get<Response<GetMomentResponse[]>>(
    `/moment/monthly/${year}/${month}`,
  );
  return data?.results || [];
};

export const getMomentRequestParams = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return { year, month, day };
};
