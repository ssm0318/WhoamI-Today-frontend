import i18n from '@i18n/index';
import {
  PastSurvey,
  Survey,
  SurveyAnswerInput,
  SurveyDraft,
  SurveyIndexResponse,
  SurveyOfTheDayResponse,
  SurveyResults,
  SurveySubmitResponse,
} from '@models/survey';

import axios, { API_BASE_URL } from './axios';

export interface SurveyDraftBackupPayload {
  answers: Record<number, unknown>;
  current_page_index: number;
  total_pages: number;
  answered_pages: number;
  progress_pct: number;
}

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
): Promise<SurveySubmitResponse> => {
  const { data } = await axios.post<SurveySubmitResponse>(`/surveys/${slug}/responses/`, {
    answers,
  });
  return data;
};

export const getSurveyDraft = async (slug: string): Promise<SurveyDraft> => {
  const { data } = await axios.get<SurveyDraft>(`/surveys/${slug}/draft/`);
  return data;
};

export const putSurveyDraft = async (
  slug: string,
  payload: SurveyDraftBackupPayload,
): Promise<SurveyDraft> => {
  const { data } = await axios.put<SurveyDraft>(`/surveys/${slug}/draft/`, payload);
  return data;
};

export const deleteSurveyDraft = async (slug: string): Promise<void> => {
  await axios.delete(`/surveys/${slug}/draft/`);
};

const readCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

export const putSurveyDraftKeepalive = (slug: string, payload: SurveyDraftBackupPayload): void => {
  if (typeof fetch === 'undefined') return;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept-Language': i18n.language,
    'X-Current-Page': window.location.pathname,
  };
  const csrfToken = readCookie('csrftoken');
  const accessToken = readCookie('access_token');
  if (csrfToken) headers['X-CSRFToken'] = csrfToken;
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  fetch(`${API_BASE_URL}surveys/${slug}/draft/`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers,
    credentials: 'include',
    keepalive: true,
  }).catch(() => undefined);
};

export const getSurveyResults = async (slug: string): Promise<SurveyResults> => {
  const { data } = await axios.get<SurveyResults>(`/surveys/${slug}/results/`);
  return data;
};

export const getPastSurveys = async (): Promise<{ results: PastSurvey[] }> => {
  const { data } = await axios.get<{ results: PastSurvey[] }>('/surveys/past/');
  return data;
};
