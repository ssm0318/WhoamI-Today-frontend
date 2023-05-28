import { MultipleChoiceQuestion, QUESTION_TYPE, ShortAnswerQuestion } from '@models/post';

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

export const multipleChoiceQuestions: MultipleChoiceQuestion[] = [
  {
    id: 1,
    content: 'I am Introverted',
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
    type: QUESTION_TYPE.MULTIPLE_CHOICE,
    answerList: [
      {
        value: -2,
        text: 'strongly disagree',
      },
      {
        value: -1,
        text: 'disagree',
      },
      {
        value: 0,
        text: 'neutral',
      },
      {
        value: 1,
        text: 'agree',
      },
      {
        value: 2,
        text: 'strongly agree',
      },
    ],
  },
  {
    id: 2,
    content: 'I enjoy outdoor activities',
    author: 'Jane Smith',
    author_detail: {
      id: 2,
      profile_image: null,
      profile_pic: 'https://example.com/profile_pic.jpg',
      url: 'https://example.com/profile/janesmith',
      username: 'janesmith',
    },
    like_count: 5,
    current_user_liked: true,
    created_at: '2023-05-27T08:45:00Z',
    type: QUESTION_TYPE.MULTIPLE_CHOICE,
    answerList: [
      {
        value: -2,
        text: 'strongly disagree',
      },
      {
        value: -1,
        text: 'disagree',
      },
      {
        value: 0,
        text: 'neutral',
      },
      {
        value: 1,
        text: 'agree',
      },
      {
        value: 2,
        text: 'strongly agree',
      },
    ],
  },
];
