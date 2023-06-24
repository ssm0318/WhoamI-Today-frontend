import { Response } from '@models/api/common';
import {
  GetMomentResponse,
  MomentRequestParams,
  PostMomentResponse,
  UpdateMomentResponse,
} from '@models/api/moment';
import { TodayMoment } from '@models/moment';
import { objectFormDataSerializer } from '@utils/validateHelpers';
import axios, { axiosFormDataInstance } from './axios';

// GET today's moment
export const getTodayMoment = async () => {
  const { year, month, day } = getMomentRequestParams(new Date());
  const { data } = await axios.get<GetMomentResponse | null>(
    `/moment/daily/${year}/${month}/${day}`,
  );
  return data;
};

// POST today's moment
export const postTodayMoment = async (moment: Partial<TodayMoment>) => {
  const { year, month, day } = getMomentRequestParams(new Date());
  const momentFormData = objectFormDataSerializer(moment);
  const { data } = await axiosFormDataInstance.post<PostMomentResponse>(
    `/moment/daily/${year}/${month}/${day}`,
    momentFormData,
  );
  return data;
};

// PUT today's moment
export const updateTodayMoment = async (moment: Partial<TodayMoment>) => {
  const { year, month, day } = getMomentRequestParams(new Date());
  const momentFormData = objectFormDataSerializer(moment);
  const { data } = await axiosFormDataInstance.put<UpdateMomentResponse>(
    `/moment/daily/${year}/${month}/${day}`,
    momentFormData,
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
