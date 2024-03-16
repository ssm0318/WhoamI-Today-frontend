import { ColorKeys, Layout, Typo } from '@design-system';
import { StyledCommonDialog } from './CommonDialog.styled';

interface CommonDialogProps {
  visible: boolean;
  title: string;
  content: string;
  cancelText: string;
  confirmText: string;
  confirmTextColor?: ColorKeys;
  onClickConfirm: () => void;
  onClickClose: () => void;
}

function CommonDialog({
  visible,
  title,
  content,
  cancelText,
  confirmText,
  confirmTextColor,
  onClickConfirm,
  onClickClose,
}: CommonDialogProps) {
  return (
    <StyledCommonDialog visible={visible} onClickDimmed={onClickClose}>
      <Layout.FlexCol w="100%" h="100%" alignItems="center">
        <Layout.FlexCol className="text_area" w="100%" p={16}>
          <Typo type="title-large" textAlign="center">
            {title}
          </Typo>
          <Typo type="body-medium" textAlign="center">
            {content}
          </Typo>
        </Layout.FlexCol>
        <Layout.FlexRow w="100%" h="100%">
          <button type="button" onClick={onClickClose}>
            <Typo type="button-medium">{cancelText}</Typo>
          </button>
          <button type="button" onClick={onClickConfirm}>
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
