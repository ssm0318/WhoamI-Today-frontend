import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import { Layout } from '@design-system';

interface Props {
  mood: string[];
  /** Emoji render size in px; used both for the archive card (28) and the live
   *  Check-In tab quadrant (32). */
  size?: number;
  /** Horizontal gap between emojis in a row. */
  gap?: number;
  /** Vertical gap between rows. */
  rowGap?: number;
}

/**
 * Two-column emoji stack for mood values.
 *
 * Lays out up to N emojis across rows of 2. An odd final emoji is centered
 * in its row. Shared between the archive card body and the live Check-In
 * tab quadrant so both renderings stay in lockstep when the design moves.
 *
 * Keys use position + per-emoji occurrence count so duplicate emojis at
 * different indices remain stable-keyed without relying on array indices
 * (which ESLint's react/no-array-index-key rule rejects).
 */
function MoodGrid({ mood, size = 28, gap = 8, rowGap = 4 }: Props) {
  if (mood.length === 0) return null;

  type Cell = { row: number; col: number; pos: number; emoji: string };
  const cells: Cell[] = [];
  mood.forEach((emoji, pos) => {
    cells.push({ row: Math.floor(pos / 2), col: pos % 2, pos, emoji });
  });

  const rowCount = cells[cells.length - 1].row + 1;
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
    <Layout.FlexCol w="100%" alignItems="center" justifyContent="center" gap={rowGap}>
      {rows.map((row) => (
        <Layout.FlexRow
          key={`row-${row[0].row}-${row.map((c) => c.pos).join('-')}`}
          w="100%"
          justifyContent="center"
          gap={gap}
        >
          {row.map((cell) => (
            <EmojiItem
              key={keyFor(cell.emoji, cell.pos)}
              emojiString={cell.emoji}
              size={size}
              bgColor="TRANSPARENT"
              outline="TRANSPARENT"
            />
          ))}
        </Layout.FlexRow>
      ))}
    </Layout.FlexCol>
  );
}

export default MoodGrid;
