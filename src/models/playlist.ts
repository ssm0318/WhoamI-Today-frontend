export interface PlaylistUser {
  id: number;
  username: string;
  profile_image?: string | null;
}

export interface PlaylistSong {
  id: number;
  user: PlaylistUser;
  track_id: string;
  created_at: string;
}
