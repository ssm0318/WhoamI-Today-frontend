import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { createGlobalStyle } from 'styled-components';
import { Colors, SvgIcon, Typo } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { clearLastPickedAt } from '@utils/browseModeActiveSession';

/**
 * Top-of-app bar that shows when the user activated a transient "Apply
 * without saving" custom mode. Acts like the "View as" preview pattern —
 * makes it visually obvious the current view is hypothetical, and gives
 * one tap to exit and return to the picker.
 *
 * Renders nothing when no mode is active or the active mode is a real
 * built-in / saved preset. The transient mode is identified by
 * `id === -1` (the sentinel set in BrowseModeSessionPrompt's
 * "Apply without saving" handler).
 */
const PREVIEW_BODY_CLASS = 'browse-mode-preview-active';

/**
 * Global style applied while preview is active: every interactive element
 * (button / link / input / etc.) gets `pointer-events: none` so the user
 * can SEE the app under their hypothetical mode but can't actually act on
 * it. The preview bar itself opts back in via `data-preview-exempt`.
 *
 * Scrolling is unaffected because we don't blanket the whole body — only
 * named interactive elements.
 */
const PreviewGlobalStyle = createGlobalStyle`
  body.${PREVIEW_BODY_CLASS} button:not([data-preview-exempt]):not([data-preview-exempt] *),
  body.${PREVIEW_BODY_CLASS} a:not([data-preview-exempt]):not([data-preview-exempt] *),
  body.${PREVIEW_BODY_CLASS} input,
  body.${PREVIEW_BODY_CLASS} textarea,
  body.${PREVIEW_BODY_CLASS} select,
  body.${PREVIEW_BODY_CLASS} [role="button"]:not([data-preview-exempt]):not([data-preview-exempt] *),
  body.${PREVIEW_BODY_CLASS} [role="link"]:not([data-preview-exempt]):not([data-preview-exempt] *),
  body.${PREVIEW_BODY_CLASS} [role="checkbox"]:not([data-preview-exempt]):not([data-preview-exempt] *) {
    pointer-events: none !important;
    cursor: default !important;
  }
  body.${PREVIEW_BODY_CLASS} [data-preview-exempt],
  body.${PREVIEW_BODY_CLASS} [data-preview-exempt] * {
    pointer-events: auto !important;
    cursor: pointer !important;
  }
`;

function BrowseModePreviewBar() {
  const [t] = useTranslation('translation', { keyPrefix: 'browse_mode' });
  const activeBrowseMode = useBoundStore((state) => state.activeBrowseMode);
  const clearActiveBrowseMode = useBoundStore((state) => state.clearActiveBrowseMode);
  const openBrowseModePicker = useBoundStore((state) => state.openBrowseModePicker);
  const openToast = useBoundStore((state) => state.openToast);
  const userId = useBoundStore((state) => state.myProfile?.id);

  const isPreview = activeBrowseMode?.kind === 'custom' && activeBrowseMode.id === -1;
  // Throttle "blocked click" toasts: rapid taps would otherwise spam the
  // toast queue. Stored as a ref because we don't want re-renders for
  // this debounce timestamp.
  const lastBlockedToastAt = useRef(0);

  // Toggle the body class so the global style above kicks in. Done as an
  // effect (not direct render) so we clean up reliably on unmount /
  // mode-change — no risk of leaving the app in a "frozen" state.
  useEffect(() => {
    if (isPreview) {
      document.body.classList.add(PREVIEW_BODY_CLASS);
      return () => document.body.classList.remove(PREVIEW_BODY_CLASS);
    }
    return undefined;
  }, [isPreview]);

  // Belt and braces over the body-class CSS: lots of interactive things in
  // this app aren't `<button>` / `[role="button"]` (e.g. ping pills, like
  // hearts, `<div onClick>` cards) so a CSS-selector approach misses them.
  // A capture-phase event listener catches every click/touch/key activation
  // before it reaches its handler, then short-circuits unless the target is
  // inside an element marked `data-preview-exempt` (the bar itself).
  useEffect(() => {
    if (!isPreview) return undefined;
    const block = (e: Event) => {
      const { target } = e;
      if (target instanceof Element && target.closest('[data-preview-exempt]')) return;
      e.preventDefault();
      e.stopPropagation();
      // Some component libraries register handlers via React's synthetic
      // system AND a native handler — stopImmediatePropagation kills both.
      e.stopImmediatePropagation();
      // Surface a toast so the user understands WHY their tap had no
      // effect, instead of just silently doing nothing. Throttled to one
      // per ~1.5 s so a flurry of taps doesn't queue a stack of toasts.
      const now = Date.now();
      if (now - lastBlockedToastAt.current > 1500) {
        lastBlockedToastAt.current = now;
        openToast({ message: String(t('preview_bar.blocked_toast')) });
      }
    };
    // `click` covers tap / mouse / Enter+Space activations on buttons.
    // We intentionally do NOT block touchstart/touchmove — that'd kill
    // body scroll on touch screens and the user wouldn't be able to see
    // how the rest of the page LOOKS in the preview.
    const events: ('click' | 'submit')[] = ['click', 'submit'];
    events.forEach((evt) => document.addEventListener(evt, block, true));
    return () => {
      events.forEach((evt) => document.removeEventListener(evt, block, true));
    };
  }, [isPreview, openToast, t]);

  if (!isPreview) return null;

  const handleExit = () => {
    clearActiveBrowseMode();
    // The user explicitly abandoned the preview — wipe last_picked_at so
    // the next page-load auto-prompts again. Without this, the freshness
    // window from the apply-without-saving moment would still be active
    // and the picker wouldn't fire on next reload.
    if (userId) clearLastPickedAt(userId);
    openBrowseModePicker();
  };

  return (
    <>
      <PreviewGlobalStyle />
      <Bar role="status" aria-live="polite" data-preview-exempt>
        <Typo type="label-large" color="PRIMARY">
          {t('preview_bar.label')}
        </Typo>
        <ExitButton
          type="button"
          onClick={handleExit}
          aria-label={String(t('preview_bar.exit_aria'))}
          data-preview-exempt
        >
          <SvgIcon name="close" size={16} />
        </ExitButton>
      </Bar>
    </>
  );
}

export default BrowseModePreviewBar;

const Bar = styled.div`
  position: sticky;
  top: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px;
  background: #f3e8ff;
  border-bottom: 1px solid ${Colors.PRIMARY};
`;

const ExitButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
