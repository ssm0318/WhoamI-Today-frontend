import { PaginationResponse } from '@models/api/common';
import { PlaylistSong } from '@models/playlist';
import axios from './axios';

export const getPlaylistFeed = async () => {
  const { data } = await axios.get<PlaylistSong[] | PaginationResponse<PlaylistSong[]>>(
    '/playlist/feed/',
  );
  // 페이지네이션된 응답인지 확인
  if (data && typeof data === 'object' && 'results' in data) {
    return (data as PaginationResponse<PlaylistSong[]>).results || [];
  }
  // 배열 응답인 경우
  return Array.isArray(data) ? data : [];
};

export const shareSong = async (trackId: string) => {
  const { data } = await axios.post<PlaylistSong>('/playlist/feed/', {
    track_id: trackId,
  });
  return data;
};

export const unshareSong = async (songId: number) => {
  await axios.delete(`/playlist/${songId}/`);
};
