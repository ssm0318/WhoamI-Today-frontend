export const setItemToSessionStorage = <T = unknown>(key: string, value: T) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('sessionStorage setItem error', error);
  }
};

export const getItemFromSessionStorage = <T = unknown>(key: string, initialValue?: T) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  } catch (error) {
    console.error('sessionStorage getItem error', error);
    return initialValue;
  }
};
