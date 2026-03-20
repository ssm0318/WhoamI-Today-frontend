import axios from './axios';

interface TmiPlaceholderResponse {
  placeholder: string;
}

export const getTmiPlaceholder = async (lang: string): Promise<string> => {
  const shortLang = lang.startsWith('ko') ? 'ko' : 'en';
  const { data } = await axios.get<TmiPlaceholderResponse>(
    `/user/tmi-placeholder/?lang=${shortLang}`,
  );
  return data.placeholder;
};
