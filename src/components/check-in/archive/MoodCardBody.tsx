import MoodGrid from '@components/check-in/mood-grid/MoodGrid';
import { CheckInComponentEntry } from '@models/checkInEntry';

interface Props {
  entry: CheckInComponentEntry;
}

/**
 * Mood card body — 2-column emoji grid.
 *
 * Thin wrapper over the shared {@link MoodGrid} so the archive card and
 * the live Check-In tab quadrant render mood identically. Layout rule:
 * up to 5 emojis across rows of 2, odd final emoji centered in its row.
 */
function MoodCardBody({ entry }: Props) {
  const data = entry.data as { mood?: string[] };
  const mood = data.mood ?? [];
  if (mood.length === 0) return null;

  return <MoodGrid mood={mood} size={28} />;
}

export default MoodCardBody;
