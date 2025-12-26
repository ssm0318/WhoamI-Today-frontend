import { PaginationResponse } from '@models/api/common';
import {
  Connection,
  FriendType,
  GetFriendsTodayResponse,
  GetUpdatedProfileResponse,
} from '@models/api/friends';
import { User } from '@models/user';
import axios from '@utils/apis/axios';
import { filterHiddenFriends } from '@utils/filterHiddenFriends';

export const getFriendsToday = async () => {
  const { data } = await axios.get<PaginationResponse<GetFriendsTodayResponse>>(
    `/user/friends/today/`,
  );
  return data;
};

export const getFriendToday = async (userId: number) => {
  const {
    data: { results },
  } = await axios.get<PaginationResponse<GetFriendsTodayResponse>>(`/user/friend/${userId}/today/`);

  return results ?? [];
};

export interface getFriendsOptions {
  filterHidden?: boolean;
  next?: string | null;
}

export const getUpdatedProfiles = async (options?: getFriendsOptions) => {
  const {
    data: { results },
  } = await axios.get<GetUpdatedProfileResponse>(
    options?.next ?? '/user/friends/?type=has_updates',
  );

  return options?.filterHidden ? filterHiddenFriends(results ?? []) : results ?? [];
};

interface GetAllFriendsFilter {
  type: FriendType;
}

export const getAllFriends = async (filter: GetAllFriendsFilter, options?: getFriendsOptions) => {
  const { data } = await axios.get<GetUpdatedProfileResponse>(
    options?.next ?? `/user/friends/?type=${filter.type}`,
  );
  return data;
};

export const addFriendToFavorite = async (userId: number) => {
  await axios.post(`/user/friends/favorites/`, {
    friend_id: userId,
  });
};

export const getFavoriteFriends = async () => {
  const {
    data: { results },
  } = await axios.get<GetUpdatedProfileResponse>('/user/friends/?type=favorites');

  return results ?? [];
};

export const deleteFavorite = async (userId: number) => {
  await axios.delete(`/user/friends/${userId}/favorites/`);
};

export const hideFriend = async (userId: number) => {
  await axios.post(`/user/friends/hidden/`, {
    friend_id: userId,
  });
};

export const unHideFriend = async (userId: number) => {
  await axios.delete(`/user/friends/${userId}/hidden/`);
};

interface ChangeConnectionOptions {
  choice: Connection;
  update_past_posts: boolean;
}

export const changeConnection = async (userId: number, options: ChangeConnectionOptions) => {
  await axios.patch<ChangeConnectionOptions>(`/user/connections/${userId}/`, options);
};

/**
 * Follower 관련 APIs
 */

// GET /api/user/follow-requests/: List received requests
// 내가 받은 팔로우 요청 목록
interface GetFollowRequestsResponse {
  requester_id: number;
  requestee_id: number;
  accepted: boolean | null;
  requester_detail: User;
}

export const getFollowRequests = async () => {
  const { data } = await axios.get<PaginationResponse<GetFollowRequestsResponse>>(
    '/user/follow-requests/',
  );
  return data;
};

// POST /api/user/follow-requests/: Send request
// 팔로우 요청 보내기
interface SendFollowRequest {
  requesterId: number;
  requesteeId: number;
}

export const sendFollowRequest = async ({ requesterId, requesteeId }: SendFollowRequest) => {
  await axios.post('/user/follow-requests/', {
    requester_id: requesterId,
    requestee_id: requesteeId,
  });
};

// GET /api/user/follow-requests/sent/: List sent requests
// 내가 보낸 팔로우 요청 목록
interface GetSentFollowRequestsResponse {
  requester_id: number;
  requestee_id: number;
  requestee_detail: User;
}

export const getSentFollowRequests = async () => {
  const { data } = await axios.get<PaginationResponse<GetSentFollowRequestsResponse>>(
    '/user/follow-requests/sent/',
  );
  return data;
};

// DELETE /api/user/follow-requests/<user_id>/: Cancel sent request
// 내가 보낸 팔로우 요청 취소
export const cancelFollowRequest = async (requesteeId: number) => {
  await axios.delete(`/user/follow-requests/${requesteeId}/`);
};

// PATCH /api/user/follow-requests/<requester_id>/respond/: Accept/Decline request
// 받은 팔로우 요청 수락/거절
export const respondToFollowRequest = async (requesterId: number, accepted: boolean) => {
  await axios.patch(`/user/follow-requests/${requesterId}/respond/`, {
    accepted,
  });
};

// GET /api/user/followers/: List followers
// 내 팔로워 목록
export const getFollowers = async () => {
  const { data } = await axios.get<PaginationResponse<User>>('/user/followers/');
  return data;
};

// GET /api/user/following/: List people I follow
// 내가 팔로우하는 사람 목록
export const getFollowing = async () => {
  const { data } = await axios.get<PaginationResponse<User>>('/user/following/');
  return data;
};
