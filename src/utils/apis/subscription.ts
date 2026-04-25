import { SubscriptionType } from '@models/subscription';
import axios from '@utils/apis/axios';

interface SubscriptionsResponse {
  types: SubscriptionType[];
}

export const getSubscriptions = async (friendId: number): Promise<SubscriptionType[]> => {
  const { data } = await axios.get<SubscriptionsResponse>(
    `/user/friends/${friendId}/subscriptions/`,
  );
  return data.types ?? [];
};

export const updateSubscriptions = async (
  friendId: number,
  types: SubscriptionType[],
): Promise<SubscriptionType[]> => {
  const { data } = await axios.post<SubscriptionsResponse>(
    `/user/friends/${friendId}/subscriptions/`,
    { types },
  );
  return data.types ?? [];
};
