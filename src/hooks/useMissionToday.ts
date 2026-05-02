import useSWR from 'swr';

import { getMissionToday, MissionToday } from '@utils/apis/missionToday';

export const MISSION_TODAY_KEY = '/missions/today/';

export function useMissionToday() {
  const { data, error, isLoading, mutate } = useSWR<MissionToday>(
    MISSION_TODAY_KEY,
    getMissionToday,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );

  return { mission: data, isLoading, error, refresh: mutate };
}
