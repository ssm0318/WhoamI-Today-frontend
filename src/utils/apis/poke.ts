import axiosInstance from '@utils/apis/axios';

export type PokeComponentType = 'song' | 'status' | 'battery';

export interface Poke {
  id: number;
  sender: number;
  receiver: number;
  component_type: PokeComponentType;
  created_at: string;
}

export async function sendPoke(
  receiverId: number,
  componentType: PokeComponentType,
): Promise<Poke> {
  const { data } = await axiosInstance.post<Poke>('/check_in/poke/', {
    receiver_id: receiverId,
    component_type: componentType,
  });
  return data;
}

export async function getPokeStatus(receiverId: number): Promise<Poke[]> {
  const { data } = await axiosInstance.get<{ results: Poke[] }>('/check_in/poke/sent/', {
    params: { receiver_id: receiverId },
  });
  return data.results ?? data;
}

export async function deletePoke(pokeId: number): Promise<void> {
  await axiosInstance.delete(`/check_in/poke/${pokeId}/`);
}
