import { ChatRoom } from '@models/api/chat';
import { FetchState } from '@models/api/common';
import { SliceStateCreator } from './useBoundStore';

const MOCK_CHAT_LIST: ChatRoom[] = [
  {
    id: 1,
    participants: [
      {
        id: 5,
        username: 'tester5',
        profile_pic: '#466C53',
        url: 'http://localhost:8000/api/user/profile/tester6/',
        profile_image: null,
        bio: '',
        pronouns: '',
      },
    ],
    last_message_content: '안녕',
    last_message_time: '2024-01-06T01:16:16.539629Z',
  },
  {
    id: 2,
    participants: [
      {
        id: 7,
        username: 'tester6',
        profile_pic: '#466C53',
        url: 'http://localhost:8000/api/user/profile/tester6/',
        profile_image: null,
        bio: '',
        pronouns: '',
      },
    ],
    last_message_content: '안녕안녕',
    last_message_time: '2024-01-06T01:16:16.539629Z',
  },
  {
    id: 3,
    participants: [
      {
        id: 2,
        username: 'tester2',
        profile_pic: '#395DF2',
        url: 'http://localhost:8000/api/user/profile/tester2/',
        profile_image: null,
        bio: '',
        pronouns: '',
      },
    ],
  },
  {
    id: 4,
    participants: [
      {
        id: 3,
        username: 'tester3',
        profile_pic: '#0758F3',
        url: 'http://localhost:8000/api/user/profile/tester3/',
        profile_image: null,
        bio: '',
        pronouns: '',
      },
    ],
  },
  {
    id: 5,
    participants: [
      {
        id: 4,
        username: 'tester4',
        profile_pic: '#619327',
        url: 'http://localhost:8000/api/user/profile/tester4/',
        profile_image: null,
        bio: '',
        pronouns: '',
      },
    ],
  },
  {
    id: 7,
    participants: [
      {
        id: 3,
        username: 'tester13',
        profile_pic: '#0758F3',
        url: 'http://localhost:8000/api/user/profile/tester3/',
        profile_image: null,
        bio: '',
        pronouns: '',
      },
    ],
  },
  {
    id: 8,
    participants: [
      {
        id: 4,
        username: 'tester14',
        profile_pic: '#619327',
        url: 'http://localhost:8000/api/user/profile/tester4/',
        profile_image: null,
        bio: '',
        pronouns: '',
      },
    ],
  },
  {
    id: 9,
    participants: [
      {
        id: 3,
        username: 'tester23',
        profile_pic: '#0758F3',
        url: 'http://localhost:8000/api/user/profile/tester3/',
        profile_image: null,
        bio: '',
        pronouns: '',
      },
    ],
  },
  {
    id: 10,
    participants: [
      {
        id: 4,
        username: 'tester9',
        profile_pic: '#619327',
        url: 'http://localhost:8000/api/user/profile/tester4/',
        profile_image: null,
        bio: '',
        pronouns: '',
      },
    ],
  },
  {
    id: 11,
    participants: [
      {
        id: 3,
        username: 'tester10',
        profile_pic: '#0758F3',
        url: 'http://localhost:8000/api/user/profile/tester3/',
        profile_image: null,
        bio: '',
        pronouns: '',
      },
    ],
  },
  {
    id: 12,
    participants: [
      {
        id: 4,
        username: 'tester11',
        profile_pic: '#619327',
        url: 'http://localhost:8000/api/user/profile/tester4/',
        profile_image: null,
        bio: '',
        pronouns: '',
      },
    ],
  },
  {
    id: 13,
    participants: [
      {
        id: 3,
        username: 'tester12',
        profile_pic: '#0758F3',
        url: 'http://localhost:8000/api/user/profile/tester3/',
        profile_image: null,
        bio: '',
        pronouns: '',
      },
    ],
  },
  {
    id: 14,
    participants: [
      {
        id: 4,
        username: 'tester13',
        profile_pic: '#619327',
        url: 'http://localhost:8000/api/user/profile/tester4/',
        profile_image: null,
        bio: '',
        pronouns: '',
      },
    ],
  },
];

interface ChatState {
  chatRoomList: FetchState<ChatRoom[]>;
}
interface ChatAction {
  setChatRoomList: (chatRoomList: FetchState<ChatRoom[]>) => void;
}

const initialState: ChatState = {
  chatRoomList: { state: 'hasValue', data: MOCK_CHAT_LIST },
};

export type ChatSlice = ChatState & ChatAction;

export const createChatSlice: SliceStateCreator<ChatSlice> = (set) => ({
  ...initialState,
  setChatRoomList: (chatRoomList) => {
    set(() => ({ chatRoomList }), false, 'chat/setChatRoomList');
  },
});
