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
