import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import BottomModalActionButton from '@components/_common/bottom-modal/BottomModalActionButton';
import Icon from '@components/_common/icon/Icon';
import { Colors, Layout, Typo } from '@design-system';
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
  const [text, setText] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle');

  useEffect(() => {
    if (visible) {
      setText('');
      setState('idle');
    }
  }, [visible]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setState('sending');
    try {
      await submitBrowseModeWishlist(trimmed);
      openToast({ message: String(t('wishlist.sent_toast')) });
      onClose();
    } catch {
      setState('error');
    }
  };

  return createPortal(
    <BottomModal visible={visible} onClose={onClose} heightMode="content">
      <Layout.FlexCol alignItems="center" w="100%" bgColor="WHITE" pb={32}>
        <Icon name="home_indicator" />
        <Layout.FlexCol alignItems="center" gap={4} pt={4} ph={16}>
          <Typo type="title-large">{t('wishlist.title')}</Typo>
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
