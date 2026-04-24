import { Layout, Typo } from '@design-system';
import { CheckInComponentEntry } from '@models/checkInEntry';
import * as S from './ArchiveCard.styled';

interface Props {
  entry: CheckInComponentEntry;
}

/**
 * Thought card body — truncated text (4 lines) with ellipsis overflow.
 *
 * Tapping the card opens the full text via ThoughtFullTextModal
 * (wired up at the Archive screen level via `onBodyClick`).
 */
function ThoughtCardBody({ entry }: Props) {
  const data = entry.data as { thought?: string };
  const thought = data.thought?.trim();
  if (!thought) return null;

  return (
    <Layout.FlexCol w="100%" h="100%" alignItems="center" justifyContent="center">
      <S.ClampText lines={4}>
        <Typo type="body-medium" color="DARK">
          {thought}
        </Typo>
      </S.ClampText>
    </Layout.FlexCol>
  );
}

export default ThoughtCardBody;
