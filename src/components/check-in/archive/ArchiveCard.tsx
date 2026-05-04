import { MouseEvent, ReactNode } from 'react';
import PrivateReplySection from '@components/check-in/private-reply/PrivateReplySection';
import { getVisibilityLabel } from '@components/check-in/visibility-toggle/VisibilityToggle';
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
  /** Optional action handlers. Omit both `onPinClick` and `onMoreClick` to
   *  render the card in read-only mode (no header icons) — that's how the
   *  friend pinned feed renders: every item in that feed is already pinned
   *  and the viewer has no control over someone else's pins, so the icons
   *  would only be visual clutter. */
  onPinClick?: (entry: CheckInComponentEntry) => void;
  onMoreClick?: (entry: CheckInComponentEntry) => void;
  onBodyClick?: (entry: CheckInComponentEntry) => void;
  /** When set on a pinned entry, the visibility chip becomes a tappable
   *  shortcut to the modify-visibility flow — saves the user from going
   *  through ⋯ → Modify visibility. Owner-only; omitted on friend cards. */
  onModifyVisibilityClick?: (entry: CheckInComponentEntry) => void;
  /** When set, renders the private reply section (friend-view only). */
  friendUsername?: string;
  /** When true, renders the private reply section in owner-view mode. */
  ownerMode?: boolean;
}

/**
 * Square archive grid cell.
 *
 * Header: timestamp (top-left). Pin + ⋯ buttons (top-right) render when
 * the caller provides the matching handler, and are omitted entirely
 * otherwise.
 *
 * Body: per-component renderer (BatteryCardBody / MoodCardBody /
 *        ThoughtCardBody / SongCardBody).
 *
 * Left-column click → body handler (opens component-specific interaction
 * like the thought full-text modal or Spotify bottom sheet). Right-column
 * icons are stop-propagation so they don't fire the body click.
 */
function ArchiveCard({
  entry,
  onPinClick,
  onMoreClick,
  onBodyClick,
  onModifyVisibilityClick,
  friendUsername,
  ownerMode,
}: ArchiveCardProps) {
  const timestamp = formatEntryTimestamp(entry.created_at);

  const body = renderBody(entry);
  const showPin = Boolean(onPinClick);
  const showMore = Boolean(onMoreClick);
  const showHeaderActions = showPin || showMore;
  const showVisibility = entry.is_pinned && !!entry.pin_visibility;
  const visibilityClickable = showVisibility && Boolean(onModifyVisibilityClick);

  const handleBody = () => onBodyClick?.(entry);
  const handlePin = (e: MouseEvent) => {
    e.stopPropagation();
    onPinClick?.(entry);
  };
  const handleMore = (e: MouseEvent) => {
    e.stopPropagation();
    onMoreClick?.(entry);
  };
  const handleVisibility = (e: MouseEvent) => {
    e.stopPropagation();
    if (visibilityClickable) onModifyVisibilityClick?.(entry);
  };

  return (
    <S.CardShell id={`entry-${entry.id}`} as="div" role="button" tabIndex={0} onClick={handleBody}>
      <S.CardHeader>
        <Layout.FlexRow alignItems="center" gap={6} style={{ minWidth: 0 }}>
          <Typo type="label-small" color="MEDIUM_GRAY">
            {timestamp}
          </Typo>
          {showVisibility && (
            <S.HeaderVisibilityBadge
              type="button"
              aria-label={
                visibilityClickable
                  ? `Change visibility (currently ${getVisibilityLabel(entry.pin_visibility!)})`
                  : `Visibility: ${getVisibilityLabel(entry.pin_visibility!)}`
              }
              onClick={handleVisibility}
              disabled={!visibilityClickable}
            >
              <Typo type="label-small" color="DARK_GRAY" fontWeight={600}>
                {getVisibilityLabel(entry.pin_visibility!)}
              </Typo>
            </S.HeaderVisibilityBadge>
          )}
        </Layout.FlexRow>
        {showHeaderActions && (
          <S.HeaderActions>
            {showPin && (
              <IconButton ariaLabel="pin" onClick={handlePin}>
                <SvgIcon
                  name={entry.is_pinned ? 'pin_filled' : 'pin_empty'}
                  size={20}
                  color={entry.is_pinned ? 'PRIMARY' : 'DARK_GRAY'}
                />
              </IconButton>
            )}
            {showMore && (
              <IconButton ariaLabel="more" onClick={handleMore}>
                <SvgIcon name="dots_menu" size={20} color="DARK_GRAY" />
              </IconButton>
            )}
          </S.HeaderActions>
        )}
      </S.CardHeader>
      <S.CardBodyWrapper>{body}</S.CardBodyWrapper>
      {friendUsername && <PrivateReplySection entry={entry} friendUsername={friendUsername} />}
      {ownerMode && <PrivateReplySection entry={entry} isOwner />}
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
