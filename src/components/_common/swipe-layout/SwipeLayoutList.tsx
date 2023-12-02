import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react';

interface SwipeLayoutListContextValue {
  hasSwipedItem: boolean;
  setHasSwipedItem: Dispatch<SetStateAction<boolean>>;
}

export const SwipeLayoutListContext = createContext<SwipeLayoutListContextValue>({
  hasSwipedItem: false,
  setHasSwipedItem: () => {
    /* noop */
  },
});

interface Props {
  children: ReactNode | ReactNode[];
}

export function SwipeLayoutList({ children }: Props) {
  const [hasSwipedItem, setHasSwipedItem] = useState(false);

  const value = useMemo(
    () => ({
      hasSwipedItem,
      setHasSwipedItem,
    }),
    [hasSwipedItem],
  );

  return (
    <SwipeLayoutListContext.Provider value={value}>{children}</SwipeLayoutListContext.Provider>
  );
}
