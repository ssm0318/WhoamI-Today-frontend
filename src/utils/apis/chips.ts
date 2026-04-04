import { CustomChip } from '@models/chips';
import axiosInstance from '@utils/apis/axios';

export async function getCustomChips(): Promise<CustomChip[]> {
  const { data } = await axiosInstance.get<CustomChip[]>('/user/me/custom-chips/');
  return Array.isArray(data) ? data : (data as any).results ?? [];
}

export async function createCustomChip(text: string, category: string): Promise<CustomChip> {
  const { data } = await axiosInstance.post<CustomChip>('/user/me/custom-chips/', {
    text,
    category,
  });
  return data;
}

export async function deleteCustomChip(chipId: number): Promise<void> {
  await axiosInstance.delete('/user/me/custom-chips/', {
    data: { id: chipId },
  });
}
