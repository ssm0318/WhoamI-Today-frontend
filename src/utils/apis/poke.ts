import axiosInstance from '@utils/apis/axios';

export type PokeComponentType = 'song' | 'status' | 'battery';

export interface PokeStatus {
  poke_count_today: number;
  poked_components: PokeComponentType[];
}

export async function sendPoke(
  receiverId: number,
  componentType: PokeComponentType,
): Promise<void> {
  await axiosInstance.post('/check-in/poke/', {
    receiver_id: receiverId,
    component_type: componentType,
  });
}

export async function getPokeStatus(receiverId: number): Promise<PokeStatus> {
  const { data } = await axiosInstance.get(`/check-in/poke/status/`, {
    params: { receiver_id: receiverId },
  });
  return data;
}
