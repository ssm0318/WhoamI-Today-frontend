export interface Note {
  id: number;
  content: string;
  created_at: string;
  current_user_like_id: number | null;
  // TBU
}
