import { MouseEvent, ReactNode } from 'react';
import { Layout, SvgIcon, Typo } from '@design-system';
import { CheckInComponentEntry, ComponentType } from '@models/checkInEntry';
import { formatEntryTimestamp } from '@utils/archiveHelpers';
import * as S from './ArchiveCard.styled';
import BatteryCardBody from './BatteryCardBody';
import MoodCardBody from './MoodCardBody';
import SongCardBody from './SongCardBody';
import ThoughtCardBody from './ThoughtCardBody';

interface ArchiveCardProps {
  entry: CheckInComponentEntry;
  /** Optional handlers — this branch wires up appearance only; actions
   *  (pin toggle, modify visibility, delete) land in feat/archive-entry-actions. */
  onPinClick?: (entry: CheckInComponentEntry) => void;
  onMoreClick?: (entry: CheckInComponentEntry) => void;
  onBodyClick?: (entry: CheckInComponentEntry) => void;
}

/**
 * Square archive grid cell.
 *
 * Header: timestamp (top-left) stacked with pin-icon + ⋯ button (top-right).
 * Body:   per-component renderer (BatteryCardBody / MoodCardBody /
 *         ThoughtCardBody / SongCardBody).
 *
 * Left-column click → body handler (opens component-specific interaction
 * like the thought full-text modal or Spotify bottom sheet). Right-column
 * icons are stop-propagation so they don't fire the body click.
 */
function ArchiveCard({ entry, onPinClick, onMoreClick, onBodyClick }: ArchiveCardProps) {
  const timestamp = formatEntryTimestamp(entry.created_at);

  const body = renderBody(entry);

  const handleBody = () => onBodyClick?.(entry);
  const handlePin = (e: MouseEvent) => {
    e.stopPropagation();
    onPinClick?.(entry);
  };
  const handleMore = (e: MouseEvent) => {
    e.stopPropagation();
    onMoreClick?.(entry);
  };

  return (
    <S.CardShell as="div" role="button" tabIndex={0} onClick={handleBody}>
      <S.CardHeader>
        <Typo type="label-small" color="MEDIUM_GRAY">
          {timestamp}
        </Typo>
        <S.HeaderActions>
          <IconButton ariaLabel="pin" onClick={handlePin}>
            <SvgIcon
              name={entry.is_pinned ? 'pin_filled' : 'pin_empty'}
              size={16}
              color={entry.is_pinned ? 'PRIMARY' : 'DARK_GRAY'}
            />
          </IconButton>
          <IconButton ariaLabel="more" onClick={handleMore}>
            <SvgIcon name="dots_menu" size={16} color="DARK_GRAY" />
          </IconButton>
        </S.HeaderActions>
      </S.CardHeader>
      <S.CardBodyWrapper>{body}</S.CardBodyWrapper>
    </S.CardShell>
  );
}

function renderBody(entry: CheckInComponentEntry) {
  switch (entry.component) {
    case ComponentType.BATTERY:
      return <BatteryCardBody entry={entry} />;
    case ComponentType.MOOD:
      return <MoodCardBody entry={entry} />;
    case ComponentType.THOUGHT:
      return <ThoughtCardBody entry={entry} />;
    case ComponentType.SONG:
      return <SongCardBody entry={entry} />;
    default:
      return null;
  }
}

interface IconButtonProps {
  ariaLabel: string;
  onClick: (e: MouseEvent) => void;
  children: ReactNode;
}

function IconButton({ ariaLabel, onClick, children }: IconButtonProps) {
  return (
    <Layout.LayoutBase
      as="button"
      aria-label={ariaLabel}
      w={20}
      h={20}
      rounded={8}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      }}
    >
      {children}
    </Layout.LayoutBase>
  );
}

export default ArchiveCard;
