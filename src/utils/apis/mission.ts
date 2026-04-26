import { Mission } from '@components/share/MissionOfTheDay';
import axios from './axios';

export const getMissions = async (): Promise<Mission[]> => {
  const { data } = await axios.get<Mission[]>('/missions/');
  return data;
};
