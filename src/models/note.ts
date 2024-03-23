export interface Note {
  id: number;
  content: string;
  image: string[];
  created_at: string;
  current_user_like_id: number | null;
  comment_count: number;
  like_count: number;
}
