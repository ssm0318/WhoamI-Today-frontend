/* eslint-disable no-underscore-dangle */
import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type StoreState<TState> = StateCreator<
  TState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  TState
>;

const middleWares = <TState>(store: StoreState<TState>) => {
  return (process.env.NODE_ENV !== 'production'
    ? devtools(immer(store))
    : immer(store)) as unknown as StateCreator<TState>;
};

// NOTE: use create<State>()(...) instead of create(...)
const _create = <TState>(state: StoreState<TState>) => create<TState>()(middleWares(state));

export default _create;
