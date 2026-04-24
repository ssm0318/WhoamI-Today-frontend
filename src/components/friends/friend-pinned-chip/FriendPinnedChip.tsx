import { CSSProperties, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SvgIcon, Typo } from '@design-system';

interface Props {
  /** Viewer-visible pinned count — hides the chip entirely when 0. */
  pinnedCount: number;
  /** Navigation target on tap. Callers route to `/users/<u>/check-in/pinned`
   *  for a friend, and `/check-in/archive?tab=pinned` for the viewer's own
   *  self-card so the tap lands on the full-control archive screen. */
  to: string;
}

/**
 * `📌 Pinned Check-ins (N)` inline link surfaced on friend cards, the
 * friend profile's Most Recent Check-In row, and the viewer's self card
 * at the top of the Friends feed.
 *
 * Rendered as a text link (no border/background, underlined label) so
 * it doesn't compete visually with the dense cluster of other pills
 * around it (battery, mood, thought, song, new-post badge, etc). The
 * pin icon prefix keeps it recognizable at a glance.
 *
 * Visible only when `pinnedCount > 0`. Click stops propagation so it
 * doesn't fire the outer card click handler.
 */
function FriendPinnedChip({ pinnedCount, to }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'archive.friend_card' });
  const navigate = useNavigate();

  if (pinnedCount <= 0) return null;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(to);
  };

  return (
    <button type="button" onClick={handleClick} style={buttonStyle}>
      <SvgIcon name="pin_filled" size={14} color="PRIMARY" />
      <span style={{ textDecoration: 'underline', textUnderlineOffset: 2 }}>
        <Typo type="label-medium" color="PRIMARY" fontWeight={500}>
          {t('pinned_count', { count: pinnedCount })}
        </Typo>
      </span>
    </button>
  );
}

const buttonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  flexShrink: 0,
};

export default FriendPinnedChip;
