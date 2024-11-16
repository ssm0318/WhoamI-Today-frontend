import useSWR from 'swr';
import { UpdateFriendListParams } from '@hooks/useInfiniteFetchFriends';
import { UpdatedProfile } from '@models/api/friends';
import { getFavoriteFriends } from '@utils/apis/friends';

export function useFetchFavoriteFriends() {
  const {
    data: favoriteFriends,
    isLoading: isFavoriteFriendsLoading,
    mutate: refetchFavoriteFriends,
  } = useSWR('/user/friends/?type=favorites', getFavoriteFriends);

  const updateFavoriteFriendList = (params: UpdateFriendListParams) => {
    if (!favoriteFriends) return;
    const { type, item } = params;

    const next: UpdatedProfile[] = favoriteFriends.filter((prev) => prev.id !== item.id);

    if (type === 'is_favorite') {
      if (params.value) {
        next.push(item);
        next.sort((a, b) => {
          if (a.username < b.username) return -1;
          if (a.username > b.username) return 1;
          return 0;
        });
      }
    }

    if (type === 'is_hidden') {
      if (!params.value && item.is_favorite) {
        next.push(item);
        next.sort((a, b) => {
          if (a.username < b.username) return -1;
          if (a.username > b.username) return 1;
          return 0;
        });
      }
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
