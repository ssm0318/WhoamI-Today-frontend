export enum Availability {
  NoStatus = 'no_status',
  NotAvailable = 'not_available',
  MayBeSlow = 'may_be_slow',
  Available = 'available',
}

export type CheckInBase = {
  id: number;
  is_active: boolean;
  created_at: string;
  mood: string;
  availability: Availability;
  description: string;
  bio: string;
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
