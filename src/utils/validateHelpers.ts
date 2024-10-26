// object의 모든 value가 null인지 확인
export const areAllValuesNull = (obj: { [key: string]: any }): boolean => {
  return Object.values(obj).every((value) => value === null);
};

// object의 모든 value가 null이 아닌지 확인
export const areAllValuesNotNull = (obj: { [key: string]: any }): boolean => {
  return Object.values(obj).every((value) => value !== null);
};

// object를 FormData 형태로 변환하는 serializer
export const objectFormDataSerializer = (object: Record<string, any>) => {
  const formData = new FormData();
  Object.keys(object).forEach((key) => {
    const value = object[key];
    formData.append(key, value || '');
  });
  return formData;
};

// object끼리 deep equal 비교
export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) {
    return true;
  }

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => deepEqual(obj1[key], obj2[key]));
};

// string 형식의 id가 유효한지 확인
export const isValidId = (id: string | undefined) => id && !Number.isNaN(Number(id));

// username을 maxLength 만큼 자르고 ...을 붙여 반환
export const shortenUsername = (username: string, maxLength = 10) => {
  return username.length > maxLength ? `${username.slice(0, maxLength)}...` : username;
};
