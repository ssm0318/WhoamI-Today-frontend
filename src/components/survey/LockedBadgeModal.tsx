import { useTranslation } from 'react-i18next';

import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';

interface LockedBadgeModalProps {
  visible: boolean;
  pointValue: number;
  prereqTitle: string;
  surveyTitle: string;
  onDoPrereq: () => void;
  onClose: () => void;
}

function LockedBadgeModal({
  visible,
  pointValue,
  prereqTitle,
  surveyTitle,
  onDoPrereq,
  onClose,
}: LockedBadgeModalProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'reimbursement' });

  return (
    <CommonDialog
      visible={visible}
      title={t('locked_badge_modal_title')}
      content={t('locked_badge_modal_body', {
        points: pointValue,
        prereqTitle,
        surveyTitle,
      })}
      cancelText={t('locked_badge_close_button')}
      confirmText={t('locked_badge_do_prereq_button')}
      confirmTextColor="PRIMARY"
      onClickConfirm={onDoPrereq}
      onClickCancel={onClose}
      onClickClose={onClose}
      trackingId="points_prereq_locked"
    />
  );
}

export default LockedBadgeModal;
