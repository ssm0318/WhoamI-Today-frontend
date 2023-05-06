import { StateCreator } from 'zustand';

interface CounterState {
  count: number;
}
interface CounterAction {
  increase: () => void;
  decrease: () => void;
  getCounterText: () => string;
  clear: () => void;
}

const initialState = {
  count: 0,
};

export type CounterSlice = CounterState & CounterAction;

export const createCounterSlice: StateCreator<CounterSlice> = (set, get) => ({
  ...initialState,
  increase: () => set(({ count }) => ({ count: count + 1 })),
  decrease: () => set(({ count }) => ({ count: count - 1 })),
  getCounterText: () => {
    const { count } = get();
    return `${count}개`;
  },
  clear: () => set(initialState),
});
