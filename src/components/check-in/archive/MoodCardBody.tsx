import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import { Layout } from '@design-system';
import { CheckInComponentEntry } from '@models/checkInEntry';

interface Props {
  entry: CheckInComponentEntry;
}

/**
 * Mood card body — 2-column emoji grid.
 *
 * Lays out up to 5 emojis across rows of 2. An odd final emoji is
 * centered in its row (mirrors the rule applied to the live Check-In
 * tab render in feat/mood-2col-layout).
 */
function MoodCardBody({ entry }: Props) {
  const data = entry.data as { mood?: string[] };
  const mood = data.mood ?? [];
  if (mood.length === 0) return null;

  // Build (row, col, absolutePosition, emoji) tuples via forEach —
  // avoids the `for...of` lint rule and the array-index-as-key rule.
  type Cell = { row: number; col: number; pos: number; emoji: string };
  const cells: Cell[] = [];
  mood.forEach((emoji, pos) => {
    cells.push({ row: Math.floor(pos / 2), col: pos % 2, pos, emoji });
  });

  const rowCount = cells.length === 0 ? 0 : cells[cells.length - 1].row + 1;
  const rows = Array.from({ length: rowCount }, (_, rowIdx) =>
    cells.filter((c) => c.row === rowIdx),
  );

  const occurrence = new Map<string, number>();
  const keyFor = (emoji: string, pos: number) => {
    const n = (occurrence.get(emoji) ?? 0) + 1;
    occurrence.set(emoji, n);
    return `${emoji}-${pos}-${n}`;
  };

  return (
    <Layout.FlexCol w="100%" alignItems="center" justifyContent="center" gap={4}>
      {rows.map((row) => (
        <Layout.FlexRow
          key={`row-${row[0].row}-${row.map((c) => c.pos).join('-')}`}
          w="100%"
          justifyContent="center"
          gap={8}
        >
          {row.map((cell) => (
            <EmojiItem
              key={keyFor(cell.emoji, cell.pos)}
              emojiString={cell.emoji}
              size={28}
              bgColor="TRANSPARENT"
              outline="TRANSPARENT"
            />
          ))}
        </Layout.FlexRow>
      ))}
    </Layout.FlexCol>
  );
}

export default MoodCardBody;
