import useSWR from 'swr';
import { UpdatedProfile } from '@models/api/friends';
import { getFavoriteFriends } from '@utils/apis/friends';

export function useFetchFavoriteFriends() {
  const {
    data: favoriteFriends,
    isLoading: isFavoriteFriendsLoading,
    mutate: refetchFavoriteFriends,
  } = useSWR('/user/friends/?type=favorites', getFavoriteFriends);

  const updateFavoriteFriendList = (friend: UpdatedProfile, value: boolean) => {
    if (!favoriteFriends) return;

    const next = favoriteFriends.filter((prev) => prev.id !== friend.id);
    if (value) {
      next.push(friend);
      next.sort((a, b) => {
        if (a.username < b.username) return -1;
        if (a.username > b.username) return 1;
        return 0;
      });
    }

    refetchFavoriteFriends(next, { revalidate: false });
  };

  return {
    favoriteFriends,
    isFavoriteFriendsLoading,
    refetchFavoriteFriends,
    updateFavoriteFriendList,
  };
}
