import { DependencyList, useEffect } from 'react';

const useAsyncEffect = (effect: () => Promise<void>, deps: DependencyList = []) => {
  useEffect(() => {
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useAsyncEffect;
