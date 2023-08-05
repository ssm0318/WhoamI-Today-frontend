import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Divider } from '@components/_common/divider/Divider.styled';
import { Button, Font, Layout } from '@design-system';

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

  return (
    <BottomModal visible={isVisible} onClose={handleOnClose}>
      <Layout.LayoutBase w="100%" bgColor="BASIC_WHITE" pt={16} ph={34} pb={45}>
        <Font.Display type="20_bold" mb={16}>
          {title}
        </Font.Display>
        <Divider width={1} />
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
    </BottomModal>
  );
}

export default ConfirmBottomModal;
