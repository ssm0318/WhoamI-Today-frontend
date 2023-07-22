import { useTranslation } from 'react-i18next';
import AlertDialog from '@components/_common/alert-dialog/AlertDialog';
import { Button, Font, Layout } from '@design-system';

export interface UserRelatedAlertProps {
  visible: boolean;
  close: () => void;
  onClickConfirm: (() => void) | (() => Promise<void>);
  confirmMsg: string;
}

function UserRelatedAlert({ visible, close, onClickConfirm, confirmMsg }: UserRelatedAlertProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });

  return (
    <AlertDialog visible={visible} onClickDimmed={close}>
      <Layout.FlexCol w="100%" alignItems="center" gap={34}>
        <Font.Body type="14_semibold" textAlign="center">
          {confirmMsg}
        </Font.Body>
        <Layout.FlexRow w="100%" justifyContent="space-evenly" alignItems="flex-start" gap={16}>
          <Button.Dialog status="normal" type="gray_fill" text={t('cancel')} onClick={close} />
          <Button.Dialog
            status="normal"
            type="gray_fill"
            text={t('confirm')}
            onClick={onClickConfirm}
          />
        </Layout.FlexRow>
      </Layout.FlexCol>
    </AlertDialog>
  );
}

export default UserRelatedAlert;
