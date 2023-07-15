import { GetMomentResponse } from './api/moment';
import { User } from './user';

export enum QUESTION_TYPE {
  SHORT_ANSWER = 'SHORT_ANSWER',
}

export enum POST_TYPE {
  RESPONSE = 'Response',
}

export interface ShareSettings {
  share_with_friends: boolean;
  share_anonymously: boolean;
}

// Question 타입 나중에 확장되면 추가
export type Question = ShortAnswerQuestion;

export interface ShortAnswerQuestion extends ContentsCommon {
  type: QUESTION_TYPE.SHORT_ANSWER;
}

export interface ContentsCommon {
  id: number;
  content: string;
  author: string | null;
  author_detail: User | AdminAuthor;
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

export const isAdminAuthor = (author: User | AdminAuthor): author is AdminAuthor => {
  return (author as AdminAuthor).color_hex !== undefined;
};
// 어드민 작성자
export interface AdminAuthor {
  color_hex: string;
}

// 답변
export interface Response extends ContentsCommon {
  type: POST_TYPE.RESPONSE;
  comments: Comment[];
  question: Question;
  question_id: number;
}

// 질문에 대한 답변 리스트
export interface DayQuestion {
  id: number;
  type: 'Question';
  content: string;
  created_at: string;
  is_admin_question: boolean;
  responses: QuestionResponse[];
}

export type QuestionResponse = Omit<ContentsCommon, 'author_detail' | 'author'> &
  ShareSettings & {
    type: POST_TYPE.RESPONSE;
    question_id: number;
    author?: string;
  };

export interface MomentPost extends GetMomentResponse {}
