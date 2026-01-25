import { PingRoom } from '@models/ping';

/** 테스트용 PingRoom 목록 (실제 API 연동 시 제거) */
export const mockPingRooms: PingRoom[] = [
  {
    id: 1,
    user1: {
      id: 1,
      username: 'alex',
      profile_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL-L1UhpS9glJRsLpcu8L2COL88RL9e_JIZw&usqp=CAU',
      url: '/api/user/profile/alex/',
    },
    user2: {
      id: 2,
      username: 'jordan',
      profile_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_9HpUdedwvWvuX-EdPNWGWQVOIcYIuI43ouVcm8O6h6_yB-bN8uPt2NyXuyPjd4mDgGk&usqp=CAU',
      url: '/api/user/profile/jordan/',
    },
    last_ping_time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    last_ping_content: '오늘 저녁 같이 먹을래?',
    last_ping_emoji: 'wave',
    unread_cnt: 2,
  },
  {
    id: 2,
    user1: {
      id: 3,
      username: 'chris',
      profile_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNys7iFvBBxifr5E1pgSgnlKxZ8G9HO-47sSR1oW57o1QAXA3YuXsmpVq1WZk9-HkoZls&usqp=CAU',
      url: '/api/user/profile/chris/',
    },
    user2: {
      id: 1,
      username: 'alex',
      profile_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL-L1UhpS9glJRsLpcu8L2COL88RL9e_JIZw&usqp=CAU',
      url: '/api/user/profile/alex/',
    },
    last_ping_time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    last_ping_content: '내일 만나자!',
    last_ping_emoji: 'smile',
    unread_cnt: 0,
  },
  {
    id: 3,
    user1: {
      id: 1,
      username: 'alex',
      profile_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL-L1UhpS9glJRsLpcu8L2COL88RL9e_JIZw&usqp=CAU',
      url: '/api/user/profile/alex/',
    },
    user2: {
      id: 4,
      username: 'taylor',
      profile_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUDvF8l753KHOWjwCmjEO1PfxYe5J95T54IA&usqp=CAU',
      url: '/api/user/profile/taylor/',
    },
    last_ping_time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    last_ping_content: '',
    last_ping_emoji: 'heart',
    unread_cnt: 1,
  },
];
