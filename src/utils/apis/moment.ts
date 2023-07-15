import { DateRequestParams, Response } from '@models/api/common';
import { GetMomentResponse, PostMomentResponse, UpdateMomentResponse } from '@models/api/moment';
import { MomentType, TodayMoment } from '@models/moment';
import { objectFormDataSerializer } from '@utils/validateHelpers';
import axios, { axiosFormDataInstance } from './axios';
import { getDateRequestParams } from './common';

// GET today's moment
export const getTodayMoment = async () => {
  const params = getDateRequestParams(new Date());
  return getDailyMoment(params);
};

// POST today's moment
export const postTodayMoment = async (moment: Partial<TodayMoment>) => {
  const { year, month, day } = getDateRequestParams(new Date());
  const momentFormData = objectFormDataSerializer(moment);
  const { data } = await axiosFormDataInstance.post<PostMomentResponse>(
    `/moment/daily/${year}/${month}/${day}/`,
    momentFormData,
  );
  return data;
};

// PUT today's moment
export const updateTodayMoment = async (moment: Partial<TodayMoment>) => {
  const { year, month, day } = getDateRequestParams(new Date());
  const momentFormData = objectFormDataSerializer(moment);
  const { data } = await axiosFormDataInstance.put<UpdateMomentResponse>(
    `/moment/daily/${year}/${month}/${day}/`,
    momentFormData,
  );
  return data;
};

export const getDailyMoment = async ({ year, month, day }: DateRequestParams) => {
  const { data } = await axios.get<GetMomentResponse | null>(
    `/moment/daily/${year}/${month}/${day}/`,
  );
  return data;
};

export const getWeeklyMoments = async ({ year, month, day }: DateRequestParams) => {
  const { data } = await axios.get<Response<GetMomentResponse[]>>(
    `/moment/weekly/${year}/${month}/${day}/`,
  );
  return data?.results || [];
};

export const getMonthlyMoments = async ({ year, month }: Omit<DateRequestParams, 'day'>) => {
  const { data } = await axios.get<Response<GetMomentResponse[]>>(
    `/moment/monthly/${year}/${month}/`,
  );
  return data?.results || [];
};

export const deleteMoment = async ({ id, type }: { id: number; type: MomentType }) => {
  return axios.delete(`/moment/${id}/${type}/`);
};
