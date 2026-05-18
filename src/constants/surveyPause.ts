/**
 * Temporary "surveys paused for maintenance" window. Computed against
 * the viewer's local clock vs an absolute UTC timestamp, so the gate
 * fires consistently regardless of the user's timezone.
 *
 * Today (2026-05-18) 4pm PT (PDT, UTC-7) = 2026-05-18T23:00:00Z. Once
 * `Date.now()` passes that instant, `isSurveysPaused()` returns false
 * and the UI returns to its normal state automatically — no second
 * deploy needed to lift the pause.
 *
 * Delete this module (and its imports) once the surveys are stable.
 */
export const SURVEYS_PAUSED_UNTIL = new Date('2026-05-18T23:00:00Z');

export function isSurveysPaused(now: Date = new Date()): boolean {
  return now < SURVEYS_PAUSED_UNTIL;
}

export const SURVEYS_PAUSED_MESSAGE_EN =
  'Surveys are being updated and will be back at 4pm PT today.';
export const SURVEYS_PAUSED_MESSAGE_KO =
  '설문이 업데이트 중이에요. 오늘 오후 4시 (PT)에 다시 열려요.';
