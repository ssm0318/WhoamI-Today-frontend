export interface ContentsCommon {
  id: number;
  content: string;
  author: string | null;
  author_detail: Author | AdminAuthor;
  like_count: number | null;
  current_user_liked: boolean;
  created_at: string;
}

// 댓글
export interface Comment extends ContentsCommon {
  is_anonymous: boolean;
  is_private: boolean;
  is_reply: boolean;
  replies: Comment[];
  target_id: number;
  type: 'Comment';
  user_tags: UserTag[];
}

// 유저 태그
export interface UserTag {
  id: number;
  tagged_username: string;
  offset: number;
  length: number;
}

// 작성자
export interface Author {
  id: number;
  profile_image: null;
  profile_pic: string;
  url: string;
  username: string;
}

// 어드민 작성자
export interface AdminAuthor {
  color_hex: string;
}