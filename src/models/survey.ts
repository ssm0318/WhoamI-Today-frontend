export type SurveyType = 'likert_5' | 'single_choice' | 'multi_choice';

export interface SurveyOption {
  id: number;
  order: number;
  label_en: string;
  label_ko: string;
  value: number;
}

export interface SurveyQuestion {
  id: number;
  order: number;
  prompt_en: string;
  prompt_ko: string;
  low_label_en: string;
  low_label_ko: string;
  high_label_en: string;
  high_label_ko: string;
  reverse_scored: boolean;
  options: SurveyOption[];
}

export interface Survey {
  slug: string;
  type: SurveyType;
  title_en: string;
  title_ko: string;
  description_en: string;
  description_ko: string;
  interpretation_en: string;
  interpretation_ko: string;
  questions: SurveyQuestion[];
  user_has_responded: boolean;
}

export interface SurveyOfTheDayResponse {
  date?: string;
  survey: Survey | null;
}

export interface SurveyAnswerInput {
  question_id: number;
  value: number | number[];
}

export type SuppressedReason =
  | 'too_few_friends'
  | 'too_few_responders'
  | 'too_few_close_friends'
  | 'delta_too_small'
  | null;

export interface AggregatedLikertDistribution {
  kind: 'aggregated_likert';
  bins: { score: number; count: number }[];
  min_score: number;
  max_score: number;
  user_score: number | null;
}

export interface OptionCountsDistribution {
  kind: 'option_counts';
  question_id: number | null;
  options: {
    option_id: number;
    value: number;
    label_en: string;
    label_ko: string;
    count: number;
  }[];
  user_choice: number | number[] | null;
}

export type SurveyDistribution = AggregatedLikertDistribution | OptionCountsDistribution;

export interface BucketResult {
  n: number;
  distribution: SurveyDistribution;
  user_percentile: number | null;
}

export interface SurveyResults {
  user_response: { id: number | null };
  population: BucketResult | null;
  population_available: boolean;
  population_suppressed_reason: SuppressedReason;
  population_required_n: number;
  friends: BucketResult | null;
  friends_available: boolean;
  friends_suppressed_reason: SuppressedReason;
  friends_required_n: number;
  close_friends: BucketResult | null;
  close_friends_available: boolean;
  close_friends_suppressed_reason: SuppressedReason;
  close_friends_required_n: number;
}

export interface SurveyResultsError {
  detail: string;
  needs_submission: boolean;
  available_at: string | null;
}

export interface PastSurvey {
  date: string;
  survey: Survey;
  user_answered: boolean;
  results_unlocked: boolean;
}
