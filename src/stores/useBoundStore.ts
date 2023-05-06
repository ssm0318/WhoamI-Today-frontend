import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { CounterSlice, createCounterSlice } from './example';

export type BoundState = CounterSlice;

type BoundStateCreator = StateCreator<
  BoundState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  BoundState
>;

const middleWares = (store: BoundStateCreator) => {
  return (process.env.NODE_ENV !== 'production'
    ? devtools(immer(store))
    : immer(store)) as unknown as StateCreator<BoundState>;
};

export const useBoundStore = create<BoundState>()(
  middleWares((...a) => ({
    ...createCounterSlice(...a),
  })),
);
