/**
 * Temporary survey pause switch. Keep the cutoff in the past unless surveys
 * explicitly need to be hidden for maintenance again.
 */
export const SURVEYS_PAUSED_UNTIL = new Date(0);

export function isSurveysPaused(now: Date = new Date()): boolean {
  return now < SURVEYS_PAUSED_UNTIL;
}

export const SURVEYS_PAUSED_MESSAGE_EN =
  'Surveys are being updated and will be back at 4pm PT today.';
export const SURVEYS_PAUSED_MESSAGE_KO =
  '설문이 업데이트 중이에요. 오늘 오후 4시 (PT)에 다시 열려요.';
