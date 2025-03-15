import { CheckInBase, SocialBattery } from '@models/checkIn';

export const userList = [
  { id: 1, profile_pic: '', name: 'gina' },
  { id: 2, profile_pic: '', name: 'gina2' },
  { id: 3, profile_pic: '', name: 'gina3' },
];

export const checkIn: CheckInBase = {
  id: 4,
  created_at: '2023-11-17T22:13:27.155202-08:00',
  is_active: true,
  mood: '🎀',
  social_battery: SocialBattery.completely_drained,
  description: 'I am available',
  track_id: '11dFghVXANMlKmJXsNCbNl',
  current_user_read: true,
};
