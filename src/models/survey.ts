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
  | 'display_only'
  | 'per_friend_likert_5'
  | 'per_friend_single_choice';

// Per-friend types render once per friend the viewer currently has. The
// backend expands each per_friend_* source row into N virtual SurveyQuestion
// rows (one per friend) at GET time, each carrying target_user_* and
// baseline_* metadata. Frontend re-groups consecutive per_friend rows by
// target_user_id and renders all of one friend's inputs on a single card.
export const PER_FRIEND_QUESTION_TYPES = new Set<QuestionType>([
  'per_friend_likert_5',
  'per_friend_single_choice',
]);

// `value` is union: backend single_choice / multi_choice options use string
// values like "mission_suggest" alongside numeric likert option values.
export type SurveyOptionValue = number | string;

export interface SurveyOption {
  id: number;
  order: number;
  label_en: string;
  label_ko: string;
  value: SurveyOptionValue;
}

// Conditional display rule. Backend authors questions with one of four
// operators; the frontend evaluates whichever is set. `depends_on` is the
// slug of the controlling question — resolved against the survey's
// questions[].slug map at render time.
export interface ConditionalDisplay {
  depends_on: string;
  show_when_value?: SurveyOptionValue;
  show_when_value_not?: SurveyOptionValue;
  show_when_value_in?: SurveyOptionValue[];
  show_when_value_includes?: SurveyOptionValue;
}

export interface SurveyQuestion {
  id: number;
  order: number;
  type: QuestionType;
  // Stable slug used by `conditional_display.depends_on` to reference
  // the controlling question. Empty string for legacy / unslugged rows.
  slug: string;
  prompt_en: string;
  prompt_ko: string;
  // Long-form helpers — optional descriptive copy under the prompt and
  // input placeholder for free_text. Empty string when unused.
  description_en: string;
  description_ko: string;
  placeholder_en: string;
  placeholder_ko: string;
  low_label_en: string;
  low_label_ko: string;
  high_label_en: string;
  high_label_ko: string;
  // Label for the "N/A" button on likert_5_na questions ("Not sure",
  // "Doesn't apply", etc.). Empty for other types.
  na_option_en: string;
  na_option_ko: string;
  // Display-only question content (markdown-light intro / section breaks).
  // Empty string for non-display_only types.
  content_en: string;
  content_ko: string;
  required: boolean;
  // Free-text minimum character requirement (0 = unrestricted).
  min_length: number;
  reverse_scored: boolean;
  conditional_display: ConditionalDisplay | null;
  // Slider-only inclusive bounds; null for non-slider types. low_label /
  // high_label double as the slider's min/max labels.
  slider_min_value: number | null;
  slider_max_value: number | null;
  options: SurveyOption[];
  // Per-friend virtual-question metadata. Populated by the backend on
  // expanded rows for PER_FRIEND_QUESTION_TYPES; null/undefined on every
  // other question. `target_user_id` identifies which friend this virtual
  // row is about; baseline_* surfaces the FriendEvaluation row written
  // when the user added that friend (NULL when no baseline exists, e.g.
  // friend was added before the evaluation flow shipped).
  target_user_id?: number | null;
  target_user_username?: string | null;
  baseline_closeness?: number | null;
  baseline_relationship_type?: string | null;
}

export interface SurveyDraft {
  answers: Record<string, unknown>;
  current_page_index: number;
  total_pages: number;
  answered_pages: number;
  progress_pct: number;
  saved_at: string;
}

export interface SurveyDraftSummary {
  progress_pct: number;
  answered_pages: number;
  total_pages: number;
  saved_at: string;
}

export interface Survey {
  slug: string;
  title_en: string;
  title_ko: string;
  description_en: string;
  description_ko: string;
  interpretation_en: string;
  interpretation_ko: string;
  // Long-form study flags. `repeatable` allows multiple submissions per
  // user (anytime_reflection-style); `editable` allows resubmit-as-edit
  // (one row, latest answers win); `closed` is researcher-set (410 on
  // submit). These drive submit-page UX (e.g. the post-submit thank-you
  // screen picks copy based on which mode the survey is in).
  repeatable: boolean;
  editable: boolean;
  closed: boolean;
  questions: SurveyQuestion[];
  user_has_responded: boolean;
  responder_count: number;
  draft: SurveyDraft | null;
}

export interface SurveyOfTheDayResponse {
  date?: string;
  survey: Survey | null;
}

export interface SurveyAnswerInput {
  question_id: number;
  // Mirrors backend SurveyAnswer.value JSONField. likert/ordinal codes are
  // numeric; categorical choices may carry strings; multi_choice picks are
  // the array form (widened to allow mixed because variance forbids
  // accepting `(number | string)[]` into `number[] | string[]`); free_text
  // is string. `null` is the NA_SENTINEL on likert_5_na questions — a
  // valid recorded answer meaning "not applicable", excluded from scoring.
  value: number | string | null | (number | string)[];
  // Required for PER_FRIEND_QUESTION_TYPES; absent on every other type.
  // Identifies which friend the answer is about. Backend rejects submits
  // whose target_user_id isn't on the submitter's friend list.
  target_user_id?: number;
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
    value: number;
    label_en: string;
    label_ko: string;
    count: number;
  }[];
  user_choice: number | number[] | null;
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

export type SurveyDistribution =
  | AggregatedLikertDistribution
  | OptionCountsDistribution
  | WordcloudDistribution
  | SliderHistogramDistribution;

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
  allow_late: boolean;
  survey: { slug: string; title_en: string; title_ko: string };
  bucket: Bucket;
  user_answered: boolean;
  submitted_at: string | null;
  redirect_url: string;
  draft: SurveyDraftSummary | null;
}

export interface SurveyIndexResponse {
  available_now: SurveyIndexEntry[];
  late_but_accepted: SurveyIndexEntry[];
  completed: SurveyIndexEntry[];
}
