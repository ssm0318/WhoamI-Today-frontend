import useSWR from 'swr';

import { getSurveyOfTheDay } from '@utils/apis/survey';

export const SURVEY_OF_THE_DAY_KEY = '/surveys/today/';

export const useSurveyOfTheDay = () => {
  return useSWR(SURVEY_OF_THE_DAY_KEY, getSurveyOfTheDay, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });
};
