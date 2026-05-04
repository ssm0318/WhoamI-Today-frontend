import { Layout, Typo } from '@design-system';
import { CheckInComponentEntry } from '@models/checkInEntry';
import ArchiveCard from './ArchiveCard';
import * as S from './ArchiveCard.styled';

interface Props {
  label: string;
  items: CheckInComponentEntry[];
  onPinClick?: (entry: CheckInComponentEntry) => void;
  onMoreClick?: (entry: CheckInComponentEntry) => void;
  onBodyClick?: (entry: CheckInComponentEntry) => void;
  onModifyVisibilityClick?: (entry: CheckInComponentEntry) => void;
  friendUsername?: string;
  ownerMode?: boolean;
}

/**
 * One date-grouped section of the archive feed: a localized label
 * ("Today" / "Yesterday" / "Mar 12") followed by a 2-col grid of
 * {@link ArchiveCard}s.
 */
function ArchiveDateSection({
  label,
  items,
  onPinClick,
  onMoreClick,
  onBodyClick,
  onModifyVisibilityClick,
  friendUsername,
  ownerMode,
}: Props) {
  return (
    <Layout.FlexCol w="100%" gap={10} mb={20}>
      <Typo type="title-small" color="DARK">
        {label}
      </Typo>
      <S.Grid>
        {items.map((entry) => (
          <ArchiveCard
            key={entry.id}
            entry={entry}
            onPinClick={onPinClick}
            onMoreClick={onMoreClick}
            onBodyClick={onBodyClick}
            onModifyVisibilityClick={onModifyVisibilityClick}
            friendUsername={friendUsername}
            ownerMode={ownerMode}
          />
        ))}
      </S.Grid>
    </Layout.FlexCol>
  );
}

export default ArchiveDateSection;
