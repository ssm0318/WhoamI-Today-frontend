import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ChatSlice, createChatSlice } from '@stores/chat';
import { CheckInSlice, createCheckInSlice } from './checkIn';
import { createEmojiPickerSlice, EmojiPickerSlice } from './emojiPicker';
import { createMomentSlice, MomentSlice } from './moment';
import { createMyPageSlice, MyPageSlice } from './my';
import { createNotificationSlice, NotificationSlice } from './notification';
import { createSignUpInfoSlice, SignUpInfoSlice } from './signUpInfo';
import { createToastSlice, ToastSlice } from './toast';
import { createTodaysQuestionsSlice, TodaysQuestionsSlice } from './todaysQuestions';
import { createUserSlice, UserSlice } from './user';

export type BoundState = MomentSlice &
  ChatSlice &
  MyPageSlice &
  SignUpInfoSlice &
  TodaysQuestionsSlice &
  UserSlice &
  NotificationSlice &
  CheckInSlice &
  ToastSlice &
  EmojiPickerSlice;

export type SliceStateCreator<Slice> = StateCreator<
  BoundState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  Slice
>;

type BoundStateCreator = StateCreator<BoundState>;
type BoundStore = SliceStateCreator<BoundState>;

const middleWares = (store: BoundStore) =>
  (process.env.NODE_ENV !== 'production'
    ? devtools(immer(store))
    : immer(store)) as BoundStateCreator;

export const useBoundStore = create<BoundState>()(
  middleWares((...a) => ({
    ...createMyPageSlice(...a),
    ...createChatSlice(...a),
    ...createMomentSlice(...a),
    ...createSignUpInfoSlice(...a),
    ...createTodaysQuestionsSlice(...a),
    ...createUserSlice(...a),
    ...createNotificationSlice(...a),
    ...createCheckInSlice(...a),
    ...createToastSlice(...a),
    ...createEmojiPickerSlice(...a),
  })),
);
