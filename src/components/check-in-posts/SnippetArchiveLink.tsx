import { CSSProperties, MouseEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Typo } from '@design-system';

interface Props {
  /** Optional prefix node (e.g. an SvgIcon) shown before the underlined label.
   *  Pass `<SvgIcon name="pin_filled" size={14} color="PRIMARY" />` for the
   *  pinned link; omit for the plain "All" link. */
  prefix?: ReactNode;
  /** i18n key under the `check_in_post` namespace. The key's value is
   *  interpolated with `{{count}}`. */
  i18nKey: string;
  /** Count rendered into the i18n template. Renders even when 0 so the
   *  affordance has a stable position — matches Ver.W's FriendPinnedChip. */
  count: number;
  /** Navigation target (passed to `useNavigate`). */
  to: string;
}

/**
 * Inline underlined-text link surfaced inside the viewer's own snippet
 * stories section header. Used for both the Pinned shortcut and the
 * All shortcut so they share styling and stack predictably.
 *
 * Mirrors Ver.W `FriendPinnedChip`'s no-border underlined-primary look.
 */
function SnippetArchiveLink({ prefix, i18nKey, count, to }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_post' });
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(to);
  };

  return (
    <button type="button" onClick={handleClick} style={buttonStyle}>
      {prefix}
      <span style={{ textDecoration: 'underline', textUnderlineOffset: 2 }}>
        <Typo type="label-medium" color="PRIMARY" fontWeight={500}>
          {t(i18nKey, { count })}
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

export default SnippetArchiveLink;
