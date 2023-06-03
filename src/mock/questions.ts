import { QUESTION_TYPE, ShortAnswerQuestion } from '@models/post';

export const shortAnswerQuestions: ShortAnswerQuestion[] = [
  {
    id: 1,
    content: 'How does electricity work?',
    author: 'John Doe',
    author_detail: {
      id: 1,
      profile_image: null,
      profile_pic: 'https://example.com/profile_pic.jpg',
      url: 'https://example.com/profile/johndoe',
      username: 'johndoe',
    },
    like_count: 10,
    current_user_liked: false,
    created_at: '2023-05-26T10:30:00Z',
    type: QUESTION_TYPE.SHORT_ANSWER,
  },
  {
    id: 2,
    content: 'What is Life?',
    author: 'John Doe',
    author_detail: {
      id: 1,
      profile_image: null,
      profile_pic: 'https://example.com/profile_pic.jpg',
      url: 'https://example.com/profile/johndoe',
      username: 'johndoe',
    },
    like_count: 10,
    current_user_liked: false,
    created_at: '2023-05-26T10:30:00Z',
    type: QUESTION_TYPE.SHORT_ANSWER,
  },
];
