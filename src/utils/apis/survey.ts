import {
  PastSurvey,
  Survey,
  SurveyAnswerInput,
  SurveyIndexResponse,
  SurveyOfTheDayResponse,
  SurveyResults,
} from '@models/survey';

import axios from './axios';

export const getSurveyOfTheDay = async (): Promise<SurveyOfTheDayResponse> => {
  const { data } = await axios.get<SurveyOfTheDayResponse>('/surveys/today/');
  return data;
};

export const getSurveyIndex = async (): Promise<SurveyIndexResponse> => {
  const { data } = await axios.get<SurveyIndexResponse>('/surveys/index/');
  return data;
};

export const getSurveyDetail = async (slug: string): Promise<Survey> => {
  const { data } = await axios.get<Survey>(`/surveys/${slug}/`);
  return data;
};

export const submitSurveyResponse = async (
  slug: string,
  answers: SurveyAnswerInput[],
): Promise<{ id: number }> => {
  const { data } = await axios.post<{ id: number }>(`/surveys/${slug}/responses/`, { answers });
  return data;
};

export const getSurveyResults = async (slug: string): Promise<SurveyResults> => {
  const { data } = await axios.get<SurveyResults>(`/surveys/${slug}/results/`);
  return data;
};

export const getPastSurveys = async (): Promise<{ results: PastSurvey[] }> => {
  const { data } = await axios.get<{ results: PastSurvey[] }>('/surveys/past/');
  return data;
};
