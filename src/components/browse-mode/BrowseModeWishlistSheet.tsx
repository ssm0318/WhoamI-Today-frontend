import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import BottomModalActionButton from '@components/_common/bottom-modal/BottomModalActionButton';
import { Colors, Layout, Typo } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { useBoundStore } from '@stores/useBoundStore';
import { submitBrowseModeWishlist } from '@utils/apis/browseMode';

interface BrowseModeWishlistSheetProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Small standalone sheet for "ideas the user wishes the picker did".
 * Was originally embedded in the customize sheet, but that conflated
 * "make a saved mode" with "send feedback" — two unrelated tasks. Now
 * it has its own entry point ("Not satisfied yet?") on the picker, so
 * users can drop a note even without saving anything.
 *
 * On successful send the sheet closes and surfaces a toast — the user
 * lands back on the picker so they can keep doing whatever they were doing.
 */
function BrowseModeWishlistSheet({ visible, onClose }: BrowseModeWishlistSheetProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'browse_mode' });
  const openToast = useBoundStore((state) => state.openToast);
  const trackEvent = useTrackEvent();
  const [text, setText] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle');
  // Tracks whether a submit succeeded in this open session — used to
  // decide between a `submitted` (positive) vs `abandoned` (negative)
  // event when the sheet closes.
  const submittedRef = useRef(false);

  useEffect(() => {
    if (visible) {
      setText('');
      setState('idle');
      submittedRef.current = false;
    }
  }, [visible]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setState('sending');
    try {
      await submitBrowseModeWishlist(trimmed);
      submittedRef.current = true;
      trackEvent('browse_mode_wishlist_submitted', { length: trimmed.length });
      openToast({ message: String(t('wishlist.sent_toast')) });
      onClose();
    } catch {
      setState('error');
    }
  };

  const handleClose = useCallback(() => {
    if (!submittedRef.current) {
      // `length` lets us distinguish "opened, typed something, abandoned"
      // from "opened, typed nothing, closed" — different UX signals.
      trackEvent('browse_mode_wishlist_abandoned', { length: text.trim().length });
    }
    onClose();
  }, [onClose, text, trackEvent]);

  return createPortal(
    <BottomModal visible={visible} onClose={handleClose} draggable>
      <div style={{ width: '100%', backgroundColor: '#FCFCFC', borderBottom: '1px solid #F0F0F0' }}>
        <Layout.FlexRow w="100%" h={44} alignItems="center" justifyContent="center">
          <Typo type="title-medium" bold>
            {t('wishlist.title')}
          </Typo>
        </Layout.FlexRow>
      </div>
      <Layout.FlexCol alignItems="center" w="100%" bgColor="WHITE" pb={32}>
        <Layout.FlexCol alignItems="center" gap={4} pt={12} ph={16}>
          <Typo type="body-medium" color="MEDIUM_GRAY" textAlign="center">
            {t('wishlist.subtitle')}
          </Typo>
        </Layout.FlexCol>

        <Layout.FlexCol w="100%" ph={16} pt={16} gap={8}>
          <WishlistTextarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (state === 'error') setState('idle');
            }}
            maxLength={2000}
            placeholder={String(t('wishlist.placeholder'))}
            rows={4}
          />
          {state === 'error' && (
            <Typo type="label-small" color="WARNING">
              {t('wishlist.error')}
            </Typo>
          )}
          <BottomModalActionButton
            status={text.trim() && state !== 'sending' ? 'normal' : 'disabled'}
            text={t('wishlist.send')}
            onClick={handleSend}
          />
        </Layout.FlexCol>
      </Layout.FlexCol>
    </BottomModal>,
    document.body,
  );
}

export default BrowseModeWishlistSheet;

const WishlistTextarea = styled.textarea`
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${Colors.LIGHT_GRAY};
  padding: 10px 12px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: ${Colors.PRIMARY};
  }
`;
