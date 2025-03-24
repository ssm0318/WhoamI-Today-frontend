export enum SocialBattery {
  completely_drained = 'completely_drained',
  low = 'low',
  needs_recharge = 'needs_recharge',
  moderately_social = 'moderately_social',
  fully_charged = 'fully_charged',
  super_social = 'super_social',
}

export type CheckInBase = {
  id: number;
  is_active: boolean;
  created_at: string;
  mood: string;
  social_battery: SocialBattery | null;
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
