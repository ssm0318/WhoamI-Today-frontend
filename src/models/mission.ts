export type MissionType = 'song' | 'question' | 'text' | 'compliment';

export interface DailyMission {
  id: number;
  slug: string;
  prompt_en: string;
  prompt_ko: string;
  type: MissionType;
}
