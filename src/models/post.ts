import { CroppedImg } from '@utils/getCroppedImg';
import { GetMomentResponse } from './api/moment';
import { User } from './user';

export enum POST_TYPE {
  RESPONSE = 'Response',
  QUESTION = 'Question',
  NOTE = 'Note',
}

export interface ShareSettings {
  share_with_friends: boolean;
  share_anonymously: boolean;
}

export interface Question {
  type: 'Question';
  id: number;
  content: string;
  created_at: string;
  is_admin_question: boolean;
  selected_dates: string[];
  selected: boolean;
}

export interface DailyQuestion extends Question {
  author: string | null;
  author_detail: User | AdminAuthor;
}

export interface ContentsCommon {
  id: number;
  content: string;
  author: string | null;
  author_detail: User;
  like_count: number | null;
  current_user_like_id: number | null;
  current_user_reaction_id_list: {
    id: number;
    emoji: string;
  }[];
  created_at: string;
  updated_at: string;
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
  like_user_sample: User[];
}

export type PrivateComment = Omit<Comment, 'id' | 'author' | 'author_detail'> &
  Pick<Partial<ContentsCommon>, 'id' | 'author' | 'author_detail'>;

// 유저 태그
export interface UserTag {
  id: number;
  tagged_username: string;
  offset: number;
  length: number;
}

export const isAdminAuthor = (author: User | AdminAuthor): author is AdminAuthor => {
  return (author as AdminAuthor).color_hex !== undefined;
};
// 어드민 작성자
export interface AdminAuthor {
  color_hex: string;
}

export interface ReactionUserSample extends User {
  like: boolean;
  reaction: string | null;
}

// 답변
export interface Response extends ContentsCommon {
  type: POST_TYPE.RESPONSE;
  comments: Comment[];
  question: DailyQuestion;
  question_id: number;
  comment_count: number | null;
  like_user_sample: User[];
  like_reaction_user_sample: ReactionUserSample[];
  current_user_read: boolean;
  is_edited: boolean;
  visibility: PostVisibility;
}

export interface Note extends ContentsCommon {
  type: POST_TYPE.NOTE;
  images: string[];
  comment_count: number | null;
  like_user_sample: User[];
  like_reaction_user_sample: ReactionUserSample[];
  comments: Comment[];
  current_user_read: boolean;
  is_edited: boolean;
  visibility: PostVisibility;
}

export interface NewNoteForm {
  content: string;
  images?: CroppedImg[];
  visibility: PostVisibility;
}
// 질문에 대한 답변 리스트
/** deprecated */
export interface DayQuestion extends Omit<Question, 'selected_dates' | 'selected'> {
  responses: QuestionResponse[];
}

export type QuestionResponse = Omit<ContentsCommon, 'author_detail' | 'author'> &
  ShareSettings & {
    type: POST_TYPE.RESPONSE;
    question_id: number;
    author?: string;
  };

export interface MomentPost extends GetMomentResponse {}

export type ResponseDetail = Response & ShareSettings;

export type Reaction = {
  id: number;
  emoji: string;
  user: User;
};

export type ReactionPostType = 'Note' | 'Response';

export interface ActorDetail {
  id: number;
  username: string;
  profile_image: string | null;
  profile_pic: string;
}

export type Like = {
  id: number;
  target_id: number;
  target_type: POST_TYPE;
  type: 'Like';
  user: string;
  user_detail: ActorDetail;
};

export type PostReaction = {
  id: number;
  type: 'Reaction' | 'Like';
  user: string;
  user_detail: ActorDetail;
  reaction: string | null;
};

export type POST_DP_TYPE = 'LIST' | 'DETAIL';

export enum PostVisibility {
  FRIENDS = 'friends',
  CLOSE_FRIENDS = 'close_friends',
}
