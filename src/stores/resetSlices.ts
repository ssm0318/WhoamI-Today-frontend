// https://docs.pmnd.rs/zustand/guides/how-to-reset-state

export const sliceResetFns = new Set<() => void>();

export const resetBoundStores = () => {
  sliceResetFns.forEach((resetFn) => {
    resetFn();
  });
};
