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

// `/api/surveys/<slug>/my_response/` returns 404 when the user hasn't submitted
// yet. The form treats 404 as "fresh start, no pre-fill"; any other status is
// surfaced as an error. Used for the editable-survey edit-existing-response
// flow — frontend opens the form pre-populated with prior answers.
export interface MyResponse {
  id: number;
  submitted_at: string;
  answers: { question_id: number; value: SurveyAnswerInput['value'] }[];
}

export const getMyResponse = async (slug: string): Promise<MyResponse | null> => {
  try {
    const { data } = await axios.get<MyResponse>(`/surveys/${slug}/my_response/`);
    return data;
  } catch (e) {
    // axios throws on 4xx/5xx; 404 = no prior response.
    const status = (e as { response?: { status?: number } })?.response?.status;
    if (status === 404) return null;
    throw e;
  }
};

export const getSurveyResults = async (slug: string): Promise<SurveyResults> => {
  const { data } = await axios.get<SurveyResults>(`/surveys/${slug}/results/`);
  return data;
};

export const getPastSurveys = async (): Promise<{ results: PastSurvey[] }> => {
  const { data } = await axios.get<{ results: PastSurvey[] }>('/surveys/past/');
  return data;
};
