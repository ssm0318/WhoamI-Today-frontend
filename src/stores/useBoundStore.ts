import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { CheckInSlice, createCheckInSlice } from './checkIn';
import { createMomentSlice, MomentSlice } from './moment';
import { createMyPageSlice, MyPageSlice } from './my';
import { createNotificationSlice, NotificationSlice } from './notification';
import { createSignUpInfoSlice, SignUpInfoSlice } from './signUpInfo';
import { createTodaysQuestionsSlice, TodaysQuestionsSlice } from './todaysQuestions';
import { createUserSlice, UserSlice } from './user';

export type BoundState = MomentSlice &
  MyPageSlice &
  SignUpInfoSlice &
  TodaysQuestionsSlice &
  UserSlice &
  NotificationSlice &
  CheckInSlice;

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
    ...createMomentSlice(...a),
    ...createSignUpInfoSlice(...a),
    ...createTodaysQuestionsSlice(...a),
    ...createUserSlice(...a),
    ...createNotificationSlice(...a),
    ...createCheckInSlice(...a),
  })),
);
