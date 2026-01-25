import { PingRoom } from '@models/ping';

/** 테스트용 PingRoom 목록 (API /ping/rooms/ 응답 형식) */
export const mockPingRooms: PingRoom[] = [
  {
    id: 1,
    last_message: '오늘 저녁 같이 먹을래?',
    last_message_time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    last_ping_emoji: 'wave',
    opponent: {
      id: 2,
      username: 'jordan',
      profile_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_9HpUdedwvWvuX-EdPNWGWQVOIcYIuI43ouVcm8O6h6_yB-bN8uPt2NyXuyPjd4mDgGk&usqp=CAU',
      url: '/api/user/profile/jordan/',
      unread_count: 2,
    },
  },
  {
    id: 2,
    last_message: '내일 만나자!',
    last_message_time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    last_ping_emoji: 'smile',
    opponent: {
      id: 3,
      username: 'chris',
      profile_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNys7iFvBBxifr5E1pgSgnlKxZ8G9HO-47sSR1oW57o1QAXA3YuXsmpVq1WZk9-HkoZls&usqp=CAU',
      url: '/api/user/profile/chris/',
      unread_count: 0,
    },
  },
  {
    id: 3,
    last_message: '',
    last_message_time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    last_ping_emoji: 'heart',
    opponent: {
      id: 4,
      username: 'taylor',
      profile_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUDvF8l753KHOWjwCmjEO1PfxYe5J95T54IA&usqp=CAU',
      url: '/api/user/profile/taylor/',
      unread_count: 1,
    },
  },
];
