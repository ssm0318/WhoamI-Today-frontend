import { useTranslation } from 'react-i18next';
import AlertDialog from '@components/_common/alert-dialog/AlertDialog';
import { Button, Font, Layout } from '@design-system';

interface DeleteAlertProps {
  visible: boolean;
  close: () => void;
  onClickConfirm: () => void;
}

function DeleteAlert({ visible, close, onClickConfirm }: DeleteAlertProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'delete_alert' });

  return (
    <AlertDialog visible={visible} onClickDimmed={close}>
      <Layout.FlexCol w="100%" alignItems="center" gap={34}>
        <Font.Body type="14_semibold" textAlign="center">
          {t('content')}
        </Font.Body>
        <Layout.FlexRow w="100%" justifyContent="space-evenly" alignItems="flex-start" gap={16}>
          <Button.Dialog status="normal" type="gray_fill" text={t('cancel_btn')} onClick={close} />
          <Button.Dialog
            status="normal"
            type="gray_fill"
            text={t('confirm_btn')}
            onClick={onClickConfirm}
          />
        </Layout.FlexRow>
      </Layout.FlexCol>
    </AlertDialog>
  );
}

export default DeleteAlert;
