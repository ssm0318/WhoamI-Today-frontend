export const sliceResetFns = new Set<() => void>();

export const resetBoundStores = () => {
  sliceResetFns.forEach((resetFn) => {
    resetFn();
  });
};
