import { TranslateTextResponse } from '@models/api/translate';
import axios from '@utils/apis/axios';

export const requestTranslateText = async (text: string, target_language: string) => {
  return axios.post<TranslateTextResponse>('/translate/', { text, target_language });
};
