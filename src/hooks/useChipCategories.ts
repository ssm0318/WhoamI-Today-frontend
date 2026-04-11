import useSWR from 'swr';
import { ChipCategoryInfo, toChipCategoryInfo } from '@models/chips';
import { getChipCategories } from '@utils/apis/chips';

export function useChipCategories() {
  const { data, isLoading } = useSWR('/user/chip-categories/', getChipCategories, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  const categories: ChipCategoryInfo[] = (data ?? []).map(toChipCategoryInfo);

  return { categories, isLoading };
}
