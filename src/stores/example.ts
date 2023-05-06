import { SliceStateCreator } from './useBoundStore';

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

export const createCounterSlice: SliceStateCreator<CounterSlice> = (set, get) => ({
  ...initialState,
  increase: () => set(({ count }) => ({ count: count + 1 }), false, 'count/increase'),
  decrease: () => set(({ count }) => ({ count: count - 1 }), false, 'count/decrease'),
  getCounterText: () => {
    const { count } = get();
    return `${count}개`;
  },
  clear: () => set(initialState, false, 'count/clear'),
});
