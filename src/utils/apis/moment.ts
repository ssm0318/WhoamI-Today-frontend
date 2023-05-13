import { GetMomentResponse } from '@models/api/moment';
import axios from './axios';

// GET today's moment
const getTodayMoment = async () => {
  const { data } = await axios.get<GetMomentResponse>('/moment/today');
  return data;
};

export { getTodayMoment };
