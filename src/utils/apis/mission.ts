import { DailyMission } from '@models/mission';
import axios from './axios';

export const getDailyMission = async (): Promise<DailyMission | null> => {
  const { data } = await axios.get<DailyMission[]>('/missions/');
  return data[0] ?? null;
};
