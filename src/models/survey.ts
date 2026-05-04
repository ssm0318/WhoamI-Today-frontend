// Question types — defined per-question so a single Survey can mix them.
// Mirror of surveys/models.py TYPE_CHOICES.
export type QuestionType =
  | 'likert_3'
  | 'likert_4'
  | 'likert_5'
  | 'likert_5_na'
  | 'likert_6'
  | 'likert_7'
  | 'single_choice'
  | 'multi_choice'
  | 'free_text'
  | 'slider'
  | 'display_only';

// Numeric range per likert variant — used by LikertChips to render the right
// number of points. Mirror of surveys/models.py LIKERT_RANGES.
export type LikertType =
  | 'likert_3'
  | 'likert_4'
  | 'likert_5'
  | 'likert_5_na'
  | 'likert_6'
  | 'likert_7';

export const LIKERT_RANGES: Record<LikertType, [number, number]> = {
  likert_3: [1, 3],
  likert_4: [1, 4],
  likert_5: [1, 5],
  likert_5_na: [1, 5],
  likert_6: [1, 6],
  likert_7: [1, 7],
};

export interface SurveyOption {
  id: number;
  order: number;
  label_en: string;
  label_ko: string;
  // Codes can be int (likert / ordinal) or string (categorical, e.g. "yes" /
  // "minor"). Backend stores as JSONField; SurveyAnswer.value follows the
  // same shape for choice questions.
  value: number | string;
}

// Form: { depends_on: <other_question_slug>, <operator>: <value(s)> }
// Hidden conditional questions skip required-validation on submit.
export interface ConditionalDisplay {
  depends_on?: string;
  show_when_value?: number | string | boolean;
  show_when_value_not?: number | string | boolean;
  show_when_value_in?: (number | string | boolean)[];
  show_when_value_includes?: number | string | boolean;
}

export interface SurveyQuestion {
  id: number;
  order: number;
  type: QuestionType;
  // Stable per-question identifier used by score formulas, embedded-data
  // storage keys, and `conditional_display.depends_on`. Empty string when
  // not set (legacy questions and display_only blocks that don't need IDs).
  slug: string;
  prompt_en: string;
  prompt_ko: string;
  // Markdown-supported secondary text shown below `prompt`.
  description_en: string;
  description_ko: string;
  // free_text-only — empty-input hint.
  placeholder_en: string;
  placeholder_ko: string;
  low_label_en: string;
  low_label_ko: string;
  high_label_en: string;
  high_label_ko: string;
  // likert_5_na-only — label for the 6th "N/A" chip.
  na_option_en: string;
  na_option_ko: string;
  // display_only-only — markdown body. No input rendered.
  content_en: string;
  content_ko: string;
  // free_text-only soft floor + warning. min_length = null means no minimum.
  min_length: number | null;
  min_length_warning_en: string;
  min_length_warning_ko: string;
  required: boolean;
  reverse_scored: boolean;
  conditional_display: ConditionalDisplay;
  // Slider-only inclusive bounds; null for non-slider types. low_label /
  // high_label double as the slider's min/max labels.
  slider_min_value: number | null;
  slider_max_value: number | null;
  options: SurveyOption[];
}

export interface Survey {
  slug: string;
  title_en: string;
  title_ko: string;
  description_en: string;
  description_ko: string;
  interpretation_en: string;
  interpretation_ko: string;
  // Survey-level static token map merged with the user's embedded data
  // before substitution. Server-side substitution applies to question
  // text fields, so the frontend usually doesn't need to read this.
  tokens: Record<string, string | number | boolean>;
  // True when the same user may submit multiple times (anytime_reflection-
  // style ongoing feedback).
  repeatable: boolean;
  // True when re-submitting REPLACES the existing response. The form
  // pre-fills with prior answers via /api/surveys/<slug>/my_response/.
  // Distinct from `repeatable` (which creates separate rows).
  editable: boolean;
  // Researcher-set close flag. When true, the form shows the past response
  // read-only; submit returns 410.
  closed: boolean;
  // Higher = surfaced earlier in the survey index. 100 = research-critical
  // (feature_eval, goal_comparison), 80 = daily/SOTD, 50 = weekly, etc.
  priority: number;
  // When non-empty, overrides per-question result rendering with a single
  // survey-level visualization (scale_score_histogram, slider_histogram_paired).
  result_kind: '' | 'scale_score_histogram' | 'slider_histogram_paired';
  questions: SurveyQuestion[];
  user_has_responded: boolean;
  responder_count: number;
}

export interface SurveyOfTheDayResponse {
  date?: string;
  survey: Survey | null;
}

export interface SurveyAnswerInput {
  question_id: number;
  // null = N/A pick on a likert_5_na question (NA_SENTINEL on the backend).
  value: number | number[] | string | string[] | null;
}

export type SuppressedReason =
  | 'too_few_friends'
  | 'too_few_responders'
  | 'too_few_close_friends'
  | 'delta_too_small'
  | 'view_friend_disabled'
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
    value: number | string;
    label_en: string;
    label_ko: string;
    count: number;
  }[];
  user_choice: number | number[] | string | string[] | null;
}

export interface WordcloudDistribution {
  kind: 'wordcloud';
  tokens: { token: string; count: number }[];
  min_token_frequency: number;
  suppressed_token_count: number;
  viewer_tokens: string[];
}

export interface SliderHistogramDistribution {
  kind: 'slider_histogram';
  question_id: number | null;
  min_value: number | null;
  max_value: number | null;
  bins: { lo: number; hi: number; count: number }[];
  mean: number | null;
  median: number | null;
  user_value: number | null;
}

export interface ScaleScoreHistogramDistribution {
  kind: 'scale_score_histogram';
  min_score: number | null;
  max_score: number | null;
  bins: { score: number; count: number }[];
  mean: number | null;
  median: number | null;
  user_score: number | null;
}

export interface SliderHistogramPairedDistribution {
  kind: 'slider_histogram_paired';
  x_question_id: number | null;
  y_question_id: number | null;
  x_min: number | null;
  x_max: number | null;
  y_min: number | null;
  y_max: number | null;
  points: { x: number; y: number }[];
  user_point: { x: number; y: number } | null;
}

export type SurveyDistribution =
  | AggregatedLikertDistribution
  | OptionCountsDistribution
  | WordcloudDistribution
  | SliderHistogramDistribution
  | ScaleScoreHistogramDistribution
  | SliderHistogramPairedDistribution;

export interface BucketResult {
  n: number;
  distribution: SurveyDistribution;
  user_percentile: number | null;
}

export interface ResultPanel {
  group_key: string;
  kind: SurveyDistribution['kind'];
  title_en: string;
  title_ko: string;
  question_count: number;
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

export interface SurveyResults {
  user_response: { id: number | null };
  panels: ResultPanel[];
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

// 4-week study schedule. Mirror of surveys/models.py CADENCE_CHOICES.
export type Cadence = 'daily' | 'weekly' | 'biweekly' | 'anytime' | 'endpoint';

// Three buckets returned by GET /api/surveys/index/. Mirror of
// surveys/scheduling.py get_survey_index().
export type Bucket = 'available_now' | 'late_but_accepted' | 'completed';

export interface SurveyIndexEntry {
  id: number;
  cadence: Cadence;
  sequence_index: number;
  window_start: string; // ISO date
  window_end: string | null; // null = open-ended (anytime, endpoint)
  survey: {
    slug: string;
    title_en: string;
    title_ko: string;
    // Sort key + render hints exposed on the index — see backend
    // SurveyMinimalSerializer.
    priority: number;
    editable: boolean;
    closed: boolean;
  };
  bucket: Bucket;
  user_answered: boolean;
  submitted_at: string | null;
  redirect_url: string;
}

export interface SurveyIndexResponse {
  available_now: SurveyIndexEntry[];
  late_but_accepted: SurveyIndexEntry[];
  completed: SurveyIndexEntry[];
}
