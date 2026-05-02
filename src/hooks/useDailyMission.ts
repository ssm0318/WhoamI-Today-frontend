import useSWR from 'swr';
import { getDailyMission } from '@utils/apis/mission';

export function useDailyMission() {
  const { data, isLoading } = useSWR('/missions/', getDailyMission, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });
  return { mission: data ?? null, isLoading };
}
