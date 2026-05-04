import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import {
  Connection,
  FriendType,
  GetUpdatedProfileResponse,
  UpdatedProfile,
} from '@models/api/friends';

interface BreakFriendsParams {
  type: 'break_friends';
  item: UpdatedProfile;
}
interface UpdateFriendsStateParams {
  type: 'is_favorite' | 'is_hidden' | 'is_subscribed';
  item: UpdatedProfile;
  value: boolean;
}
interface UpdateConnectionStatusParams {
  type: 'connection_status';
  item: UpdatedProfile;
  value: Connection;
}
interface MarkReadParams {
  type: 'mark_read';
  item: UpdatedProfile;
}

export type UpdateFriendListParams =
  | BreakFriendsParams
  | UpdateFriendsStateParams
  | UpdateConnectionStatusParams
  | MarkReadParams;

interface UseInfiniteFetchFriendsParams {
  type?: FriendType | 'hidden';
}

const useInfiniteFetchFriends = ({ type: friendType }: UseInfiniteFetchFriendsParams) => {
  const { targetRef, data, isLoading, mutate, isEndPage, isLoadingMore } =
    useSWRInfiniteScroll<UpdatedProfile>({ key: `/user/friends/?type=${friendType}` });

  const updateFriendList = (params: UpdateFriendListParams) => {
    if (!data) return;
    const {
      type,
      item: { id: userId },
    } = params;

    let next: GetUpdatedProfileResponse[];
    if (type === 'break_friends') {
      next = data.map((prev) => {
        if (!prev.results) return prev;
        return {
          ...prev,
          results: prev.results.filter((user) => user.id !== userId),
        };
      });
    } else if (type === 'mark_read') {
      next = data.map((prev) => {
        if (!prev.results) return prev;
        const selectedFriendIndex = prev.results.findIndex((user) => user.id === userId);
        if (selectedFriendIndex === -1) return prev;

        const friend = prev.results[selectedFriendIndex];
        return {
          ...prev,
          results: [
            ...prev.results.slice(0, selectedFriendIndex),
            {
              ...friend,
              current_user_read_check_in: true,
              current_user_read: true,
              unread_post_cnt: 0,
              recent_posts: friend.recent_posts?.map((p) => ({
                ...p,
                current_user_read: true,
              })),
            },
            ...prev.results.slice(selectedFriendIndex + 1),
          ],
        };
      });
    } else {
      next = data.map((prev) => {
        if (!prev.results) return prev;
        const selectedFriendIndex = prev.results.findIndex((user) => user.id === userId);
        if (selectedFriendIndex === -1) return prev;

        return {
          ...prev,
          results: [
            ...prev.results.slice(0, selectedFriendIndex),
            {
              ...prev.results[selectedFriendIndex],
              [type]: params.value,
            },
            ...prev.results.slice(selectedFriendIndex + 1),
          ],
        };
      });
    }

    mutate(next, { revalidate: false });
  };

  return {
    isLoadingMoreAllFriends: isLoadingMore,
    targetRef,
    allFriends: data,
    isAllFriendsLoading: isLoading,
    isEndPage,
    updateFriendList,
    refetchAllFriends: mutate,
  };
};

export default useInfiniteFetchFriends;
