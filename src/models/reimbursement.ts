export type PointSourceKind = 'survey' | 'wit_bot_audit' | 'interview_signup';

export interface PointAwardSummary {
  awarded_points: number;
  adjusted_points: number | null;
  effective_points: number;
  note: string;
}

export interface ReimbursementAward extends PointAwardSummary {
  source_kind: PointSourceKind;
  source_slug: string;
  scheduled_survey_id: number | null;
  title_en: string;
  title_ko: string;
  cadence: string | null;
  window_start: string | null;
  window_end: string | null;
  submitted_at: string;
}

export interface PendingPointPrereq {
  survey_slug: string;
  scheduled_survey_id: number | null;
  title_en: string;
  title_ko: string;
  potential_points: number;
  prereq_slug: string;
  prereq_title_en: string;
  prereq_title_ko: string;
}

export interface ReimbursementState {
  provisional_total: number;
  adjusted_total: number;
  available_max: number;
  dollar_estimate_cents: number;
  points_per_dollar: number;
  awards: ReimbursementAward[];
  pending_prereqs: PendingPointPrereq[];
}
