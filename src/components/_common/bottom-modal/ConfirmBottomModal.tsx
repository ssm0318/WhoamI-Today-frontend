import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Button, Layout, Typo } from '@design-system';

interface ConfirmBottomModalProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  title: string;
  children: ReactNode;
  confirmText: string;
  onConfirm: () => void;
}
function ConfirmBottomModal({
  isVisible,
  setIsVisible,
  title,
  children,
  confirmText,
  onConfirm,
}: ConfirmBottomModalProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'settings' });

  const handleOnClose = () => {
    setIsVisible(false);
  };

  return createPortal(
    <BottomModal visible={isVisible} onClose={handleOnClose} draggable>
      <div style={{ width: '100%', backgroundColor: '#FCFCFC', borderBottom: '1px solid #F0F0F0' }}>
        <Layout.FlexRow w="100%" h={44} alignItems="center" justifyContent="center">
          <Typo type="title-medium" bold>
            {title}
          </Typo>
        </Layout.FlexRow>
      </div>
      <Layout.LayoutBase w="100%" bgColor="WHITE" pt={16} ph={34} pb={45}>
        {children}
        <Button.RowButtonContainer>
          <Button.Medium
            type="gray_fill"
            status="normal"
            text={t('cancel')}
            sizing="stretch"
            onClick={handleOnClose}
          />
          <Button.Medium
            type="gray_fill"
            status="normal"
            text={confirmText}
            sizing="stretch"
            onClick={onConfirm}
          />
        </Button.RowButtonContainer>
      </Layout.LayoutBase>
    </BottomModal>,
    document.getElementById('root-container') || document.body,
  );
}

export default ConfirmBottomModal;
