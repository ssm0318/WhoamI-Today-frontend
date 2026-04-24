import { CSSProperties, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SvgIcon, Typo } from '@design-system';

interface Props {
  username: string;
  /** Viewer-visible pinned count from FriendListSerializer.pinned_count. */
  pinnedCount: number;
}

/**
 * `📌 Pinned Check-ins (N)` inline link surfaced on each friend's card
 * and on the friend profile's Most Recent Check-In row.
 *
 * Rendered as a text link (no border/background, underlined label)
 * rather than a bordered chip so it doesn't compete visually with the
 * dense cluster of other pill-shaped affordances around it (battery,
 * mood, thought, song, new-post badge, etc). The pin icon prefix
 * keeps it recognizable at a glance.
 *
 * Visible only when the friend has at least one pin visible to this
 * viewer (N > 0 per the backend's visibility filter). Tapping navigates
 * to the read-only friend pinned feed; the outer card click handler is
 * short-circuited via stopPropagation so users don't get accidentally
 * dropped on the profile page.
 */
function FriendPinnedChip({ username, pinnedCount }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'archive.friend_card' });
  const navigate = useNavigate();

  if (pinnedCount <= 0) return null;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${username}/check-in/pinned`);
  };

  return (
    <button type="button" onClick={handleClick} style={buttonStyle}>
      <SvgIcon name="pin_filled" size={14} color="PRIMARY" />
      <span style={{ textDecoration: 'underline', textUnderlineOffset: 2 }}>
        <Typo type="label-medium" color="PRIMARY">
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
