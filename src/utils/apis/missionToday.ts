import { MissionType } from '@components/share/MissionOfTheDay';
import axios from './axios';

export interface MissionToday {
  id: number;
  prompt: string;
  type: MissionType;
  attempts_used: number;
  attempts_remaining: number;
  max_attempts: number;
}

export const getMissionToday = async (): Promise<MissionToday> => {
  const { data } = await axios.get<MissionToday>('/missions/today/');
  return data;
};
