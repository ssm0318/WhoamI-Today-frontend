import { ComponentProps } from 'react';
import { ColorKeys, Layout, Typo } from '@design-system';
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
}: CommonDialogProps) {
  return (
    <StyledCommonDialog visible={visible} onClickDimmed={onClickClose}>
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
          <button type="button" onClick={onClickCancel ?? onClickClose}>
            <Typo type="button-medium" color={cancelTextColor}>
              {cancelText}
            </Typo>
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
