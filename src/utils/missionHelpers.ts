import { Note } from '@models/post';

export function compareMissionAttemptOrder(a: Note, b: Note) {
  const aAttempt = a.mission_attempt_number ?? Number.MAX_SAFE_INTEGER;
  const bAttempt = b.mission_attempt_number ?? Number.MAX_SAFE_INTEGER;
  if (aAttempt !== bAttempt) return aAttempt - bAttempt;
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}
