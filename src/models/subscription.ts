export enum SubscriptionType {
  // Ver. W
  BATTERY = 'battery',
  MOOD = 'mood',
  THOUGHT = 'thought',
  SONG = 'song',
  MISSION_OF_THE_DAY = 'mission_of_the_day',
  QUESTION_OF_THE_DAY = 'question_of_the_day',
  PHOTO_OF_THE_DAY = 'photo_of_the_day',
  // Ver. Q
  CHECK_IN = 'check_in',
  POST = 'post',
}

export const VER_W_SUBSCRIPTION_TYPES: SubscriptionType[] = [
  SubscriptionType.BATTERY,
  SubscriptionType.MOOD,
  SubscriptionType.THOUGHT,
  SubscriptionType.SONG,
  SubscriptionType.MISSION_OF_THE_DAY,
  SubscriptionType.QUESTION_OF_THE_DAY,
  SubscriptionType.PHOTO_OF_THE_DAY,
];

export const VER_Q_SUBSCRIPTION_TYPES: SubscriptionType[] = [
  SubscriptionType.CHECK_IN,
  SubscriptionType.POST,
];
