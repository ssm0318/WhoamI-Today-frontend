import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Typo } from '@design-system';
import { StyledBottomMenuDialog } from './BottomMenuDialog.styled';

interface Props {
  children: ReactNode | ReactNode[];
  className?: string;
  visible: boolean;
  onClickClose: () => void;
}

export function BottomMenuDialog({ children, className, visible, onClickClose }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'common' });
  return (
    <StyledBottomMenuDialog
      className={className}
      visible={visible}
      position="bottom"
      onClickDimmed={onClickClose}
    >
      <Layout.FlexCol w="100%" alignItems="center" gap={8}>
        <Layout.FlexCol w="100%" className="menu-list" alignItems="center" rounded={13}>
          {children}
        </Layout.FlexCol>
        <Layout.FlexCol w="100%" className="menu-list" alignItems="center" rounded={13}>
          <button type="button" onClick={onClickClose}>
            <Typo type="button-large" color="DARK_GRAY">
              {t('cancel')}
            </Typo>
          </button>
        </Layout.FlexCol>
      </Layout.FlexCol>
    </StyledBottomMenuDialog>
  );
}
