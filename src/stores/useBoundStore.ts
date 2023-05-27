import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { CounterSlice, createCounterSlice } from './example';
import { createMomentSlice, MomentSlice } from './moment';
import { CalendarViewSlice, createCalendarViewSlice } from './my';

export type BoundState = CounterSlice & MomentSlice & CalendarViewSlice;

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
    ...createCounterSlice(...a),
    ...createCalendarViewSlice(...a),
    ...createMomentSlice(...a),
  })),
);
