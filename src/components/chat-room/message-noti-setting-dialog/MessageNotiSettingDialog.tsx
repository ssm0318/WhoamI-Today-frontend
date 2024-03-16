import { useTranslation } from 'react-i18next';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';

interface Props {
  visible: boolean;
  onClickMute: () => void;
  onClose: () => void;
}

export function MessageNotiSettingDialog({ visible, onClickMute, onClose }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'chat_room.noti_setting_dialog' });

  const handleClickMute = () => {
    onClickMute();
    onClose();
  };

  return (
    <CommonDialog
      visible={visible}
      title={t('title')}
      content={t('content')}
      cancelText={t('cancel')}
      confirmText={t('confirm')}
      confirmTextColor="PRIMARY"
      onClickConfirm={handleClickMute}
      onClickClose={onClose}
    />
  );
}
