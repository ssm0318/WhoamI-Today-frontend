export type PointSourceKind =
  | 'survey'
  | 'wit_bot_audit'
  | 'interview_signup'
  | 'app_usage'
  | 'friend_invite'
  | 'researcher_adjustment';

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
  is_final: boolean;
  provisional_total: number;
  adjusted_total: number;
  available_max: number;
  dollar_estimate_cents: number;
  points_per_dollar: number;
  awards: ReimbursementAward[];
  pending_prereqs: PendingPointPrereq[];
  interview_opportunity: {
    completed: boolean;
    potential_points: number;
    signup_url: string | null;
  };
  policy_notice_en: string;
}

export interface LocalPreviewRow {
  key: string;
  kind: 'survey' | 'manual';
  slug: string;
  title: string;
  category: string;
  points: number;
  rawPoints: number;
  possiblePoints: number;
  currentPossiblePoints?: number;
  completedCount: number;
  appUrl: string;
  canEarn: boolean;
  availability: 'available' | 'late' | 'future' | 'deadline' | 'no_action';
  capGroup: string;
  capPoints: number | null;
  gateSlug: string;
  latePercent: number;
  priorityRating: number;
  status: 'earned' | 'pending' | 'locked';
  note: string;
}

export interface LocalPreviewRule {
  group: string;
  capPoints: number | null;
  sourceCount: number;
  availablePoints: number;
  earnedPoints: number;
}

export interface LocalPreviewUser {
  id: number | null;
  username: string;
  responseTotal: number;
}

export interface LocalPreviewDb {
  name: string;
  participantCount: number;
}

export interface LocalAllocationPreview {
  db: LocalPreviewDb;
  selectedUser: LocalPreviewUser;
  pointsPerDollar: number;
  availableMax: number;
  earnedPoints: number;
  estimatedDollars: string;
  sourceCount: number;
  rows: LocalPreviewRow[];
  capRules: LocalPreviewRule[];
  gateRules: LocalPreviewRow[];
  lateRules: LocalPreviewRow[];
}
