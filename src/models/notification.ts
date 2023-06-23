export interface Notification {
  id: number;
  redirect_url: string;
  is_read: boolean;
  actor_detail: ActorDetail;
  message: string;
  is_response_request: boolean;
  question_content: string;
  created_at: string;
}

export interface ActorDetail {
  username: string;
  profile_image: string | null;
  profile_pic: string;
  color_hex: string | null;
}
