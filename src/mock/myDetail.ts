import { friendList } from '@mock/friends';
import { GetMomentResponse } from '@models/api/moment';
import { Comment, DayQuestion, POST_TYPE } from '@models/post';

export const MOCK_MOMENT: GetMomentResponse = {
  id: 7,
  type: 'Moment',
  like_count: 1,
  current_user_like_id: null,
  description: '맛있는 감바스',
  mood: '🍤🧄🥖',
  photo:
    'data:image/jpeg;base64,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',
  date: '2023-05-20',
  created_at: '2023-06-03T14:40:11.939262+09:00',
};

export const MOCK_QUESTIONS: DayQuestion[] = [
  {
    id: 1,
    type: 'Question',
    content: '오늘 점심에 먹은 음식은?',
    created_at: '2023-05-20T09:40:00.939262+09:00',
    is_admin_question: true,
    responses: [
      {
        id: 1,
        type: POST_TYPE.RESPONSE,
        content: '감바스',
        like_count: 10,
        current_user_like_id: null,
        share_with_friends: true,
        share_anonymously: true,
        created_at: '2023-05-20T09:40:00.939262+09:00',
        question_id: 1,
      },
      {
        id: 3,
        type: POST_TYPE.RESPONSE,
        content:
          '리코타 치즈 샐러드, 버터 갈릭 브레드, 쉬림프 파스타, 알리오 올리오, 에그 베네딕트',
        like_count: 5,
        current_user_like_id: null,
        share_with_friends: true,
        share_anonymously: true,
        created_at: '2023-05-20T09:40:00.939262+09:00',
        question_id: 1,
      },
      {
        id: 5,
        type: POST_TYPE.RESPONSE,
        content: '고등어회 고기국수 딱새우',
        like_count: 5,
        current_user_like_id: null,
        share_with_friends: true,
        share_anonymously: true,
        created_at: '2023-05-20T09:40:00.939262+09:00',
        question_id: 1,
      },
    ],
  },
  {
    id: 2,
    type: 'Question',
    content: '좋아하는 색깔은?',
    created_at: '2023-05-20T14:26:11.939262+09:00',
    is_admin_question: true,
    responses: [
      {
        id: 2,
        type: POST_TYPE.RESPONSE,
        content: '노랑',
        like_count: 1,
        current_user_like_id: null,
        share_with_friends: true,
        share_anonymously: true,
        created_at: '2023-05-20T09:40:00.939262+09:00',
        question_id: 2,
      },
      {
        id: 4,
        type: POST_TYPE.RESPONSE,
        content: '빨주노초파남보',
        like_count: null,
        current_user_like_id: null,
        share_with_friends: true,
        share_anonymously: true,
        created_at: '2023-05-20T09:40:00.939262+09:00',
        question_id: 2,
      },
    ],
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    type: 'Comment',
    content: 'comment 1',
    like_count: 0,
    current_user_like_id: null,
    created_at: '2023-07-01T15:21:35.916420+09:00',
    is_reply: false,
    is_private: false,
    is_anonymous: false,
    target_id: 7,
    user_tags: [],
    author: friendList[0].url,
    author_detail: friendList[0],
    replies: [
      {
        id: 3,
        type: 'Comment',
        content: 'reply 1',
        like_count: 2,
        current_user_like_id: null,
        created_at: '2023-07-01T17:22:35.916420+09:00',
        is_reply: true,
        is_private: false,
        is_anonymous: false,
        target_id: 7,
        user_tags: [],
        author: friendList[3].url,
        author_detail: friendList[3],
        replies: [],
      },
      {
        id: 4,
        type: 'Comment',
        content: 'reply 2',
        like_count: 1,
        current_user_like_id: null,
        created_at: '2023-07-01T17:22:35.916420+09:00',
        is_reply: true,
        is_private: false,
        is_anonymous: false,
        target_id: 7,
        user_tags: [],
        author: friendList[2].url,
        author_detail: friendList[2],
        replies: [],
      },
    ],
  },
  {
    id: 2,
    type: 'Comment',
    content: 'comment 2',
    like_count: 1,
    current_user_like_id: null,
    created_at: '2023-07-01T15:21:35.916420+09:00',
    is_reply: false,
    is_private: false,
    is_anonymous: false,
    target_id: 7,
    user_tags: [],
    author: friendList[1].url,
    author_detail: friendList[1],
    replies: [],
  },
];
