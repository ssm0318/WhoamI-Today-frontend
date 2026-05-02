import { ComponentProps, useCallback, useEffect, useRef } from 'react';
import { ColorKeys, Layout, Typo } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { StyledCommonDialog } from './CommonDialog.styled';

export interface CommonDialogProps {
  visible: boolean;
  title: string;
  titleType?: ComponentProps<typeof Typo>['type'];
  content?: string | null;
  cancelText: string;
  confirmText: string;
  cancelTextColor?: ColorKeys;
  confirmTextColor?: ColorKeys;
  onClickConfirm: () => void;
  onClickCancel?: () => void;
  onClickClose: () => void;
  /**
   * Stable identifier used to tag analytics events for this dialog. Lets
   * us tell e.g. "delete preset confirm" apart from "block user confirm"
   * in Firebase. Recommend snake_case and unique-per-dialog-purpose. If
   * omitted, the dialog's `title` string is used as a fallback — works
   * but couples analytics keys to copy changes, so explicit is better.
   */
  trackingId?: string;
}

/**
 * Generates an analytics-safe id from arbitrary text. Lower-case, replaces
 * runs of non-word characters with `_`, trims leading/trailing `_`. Cap at
 * 60 chars so Firebase doesn't reject it (their event-param length limit
 * is 100, but we leave headroom).
 */
function fallbackId(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 60) || 'untitled'
  );
}

function CommonDialog({
  visible,
  title,
  titleType = 'title-large',
  content,
  cancelText,
  confirmText,
  cancelTextColor,
  confirmTextColor,
  onClickConfirm,
  onClickCancel,
  onClickClose,
  trackingId,
}: CommonDialogProps) {
  const trackEvent = useTrackEvent();
  // Resolved analytics id, stable across renders within a session.
  const dialogId = trackingId ?? fallbackId(title);
  // Tracks whether the user resolved the dialog explicitly (confirm or
  // cancel button) vs implicitly (dimmed-area click / Escape). Lets us
  // tell the difference between "considered, then declined" and "tapped
  // outside without thinking" — different UX signals.
  const explicitOutcomeRef = useRef(false);

  // Fire `_shown` when visible flips to true. The dependency on `visible`
  // alone (not dialogId) is intentional — re-rendering the same dialog
  // shouldn't re-fire a shown event.
  useEffect(() => {
    if (visible) {
      explicitOutcomeRef.current = false;
      trackEvent('confirm_dialog_shown', { dialog_id: dialogId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleConfirm = useCallback(() => {
    explicitOutcomeRef.current = true;
    trackEvent('confirm_dialog_confirmed', { dialog_id: dialogId });
    onClickConfirm();
  }, [dialogId, onClickConfirm, trackEvent]);

  const handleCancel = useCallback(() => {
    explicitOutcomeRef.current = true;
    trackEvent('confirm_dialog_canceled', { dialog_id: dialogId });
    if (onClickCancel) onClickCancel();
    else onClickClose();
  }, [dialogId, onClickCancel, onClickClose, trackEvent]);

  // Dim-area click and Escape key both route through onClickClose. Only
  // count as "dismissed" if neither button was tapped first.
  const handleDismiss = useCallback(() => {
    if (!explicitOutcomeRef.current) {
      trackEvent('confirm_dialog_dismissed', { dialog_id: dialogId });
    }
    onClickClose();
  }, [dialogId, onClickClose, trackEvent]);

  return (
    <StyledCommonDialog visible={visible} onClickDimmed={handleDismiss}>
      <Layout.FlexCol w="100%" h="100%" alignItems="center">
        <Layout.FlexCol className="text_area" w="100%" p={16} alignItems="center">
          <Typo type={titleType} textAlign="center">
            {title}
          </Typo>
          {content && (
            <Typo type="body-medium" textAlign="center" pre>
              {content}
            </Typo>
          )}
        </Layout.FlexCol>
        <Layout.FlexRow w="100%" h="100%">
          <button type="button" onClick={handleCancel}>
            <Typo type="button-medium" color={cancelTextColor}>
              {cancelText}
            </Typo>
          </button>
          <button type="button" onClick={handleConfirm}>
            <Typo type="button-medium" color={confirmTextColor}>
              {confirmText}
            </Typo>
          </button>
        </Layout.FlexRow>
      </Layout.FlexCol>
    </StyledCommonDialog>
  );
}

export default CommonDialog;
