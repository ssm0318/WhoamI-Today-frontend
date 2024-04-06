export interface Note {
  id: number;
  content: string;
  images: string[];
  created_at: string;
  current_user_like_id: number | null;
  comment_count: number;
  like_count: number;
}
