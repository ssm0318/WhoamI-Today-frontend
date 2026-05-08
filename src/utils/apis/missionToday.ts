import { MissionType } from '@components/share/MissionOfTheDay';
import axios from './axios';

export interface MissionToday {
  id: number;
  prompt: string;
  type: MissionType;
  // Mission semantics:
  // - type='none' + cta_url set → Share tab "Do it" goes directly to cta_url
  //   (action-only mission, no post creation).
  // - type !='none' + cta_url set → Share tab "Do it" goes to /notes/new
  //   (chat-based mission like May 5 wit_bot; cta_url surfaces on next-day
  //   digest card only).
  // - cta_url empty → Share tab uses standard type-based routing.
  cta_url: string;
  // Plain-text label for the discover digest button (per-mission). Empty →
  // frontend falls back to "View mission posts".
  cta_label: string;
  attempts_used: number;
  attempts_remaining: number;
  max_attempts: number;
}

export const getMissionToday = async (): Promise<MissionToday> => {
  const { data } = await axios.get<MissionToday>('/missions/today/');
  return data;
};
