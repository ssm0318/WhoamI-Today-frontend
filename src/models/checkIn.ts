export enum Availability {
  available = 'available',
  busy = 'busy',
  might_get_distracted = 'might_get_distracted',
  urgent_only = 'urgent_only',
  about_to_sleep = 'about_to_sleep',
  studying = 'studying',
  in_transit = 'in_transit',
  feeling_social = 'feeling_social',
  feeling_quiet = 'feeling_quiet',
}

export type CheckInBase = {
  id: number;
  is_active: boolean;
  created_at: string;
  mood: string;
  availability: Availability | null;
  description: string;
  track_id: string;
  current_user_read: boolean;
};

export type MyCheckIn = CheckInBase & {
  share_everyone: boolean;
  // FIXME: share_everyone, share_groups, share_friends의 타입 수정 필요
  share_groups: any[];
  shrare_friends: any[];
};

export type CheckInForm = Omit<
  CheckInBase,
  'id' | 'is_active' | 'created_at' | 'current_user_read'
>;
