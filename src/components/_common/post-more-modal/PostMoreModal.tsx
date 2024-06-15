import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomMenuDialog } from '@components/_common/alert-dialog/bottom-menu-dialog/BottomMenuDialog';
import CommonDialog, {
  CommonDialogProps,
} from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import { Typo } from '@design-system';
import { Note, Response } from '@models/post';
import { reportContent } from '@utils/apis/common';

interface PostMoreModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  post: Note | Response;
  isMyPage?: boolean;
  onConfirmReport?: () => Promise<void>;
}

type AlertProps = Pick<
  CommonDialogProps,
  'title' | 'content' | 'confirmText' | 'onClickConfirm' | 'cancelText'
>;

function PostMoreModal({
  isVisible,
  isMyPage = false,
  setIsVisible,
  post,
  onConfirmReport,
}: PostMoreModalProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'post_more_modal' });
  const [showAlert, setShowAlert] = useState<AlertProps>();

  const closeMoreModal = () => {
    setIsVisible(false);
  };

  const handleOnCloseAlert = () => setShowAlert(undefined);
  const handleOnConfirmAlert = () => {
    handleOnCloseAlert();
    closeMoreModal();
  };

  const handleClickReportUser = () => {
    setShowAlert({
      title: t('report.title'),
      content: t('report.content'),
      confirmText: t('report.report'),
      cancelText: t('report.cancel'),
      onClickConfirm: async () => {
        await reportContent(post.id, post.type);
        onConfirmReport?.();
        handleOnConfirmAlert();
      },
    });
    closeMoreModal();
  };

  const handleClickEditPost = () => {
    //
  };

  const handleClickDeletePost = () => {
    //
  };

  return (
    <>
      <BottomMenuDialog visible={isVisible} onClickClose={closeMoreModal}>
        {/* TODO isMyPage인 경우 필요한 메뉴 추가 */}
        {isMyPage ? (
          <>
            <button type="button" onClick={handleClickEditPost}>
              <Typo type="button-large">{t('menu.edit')}</Typo>
            </button>
            <button type="button" onClick={handleClickDeletePost}>
              <Typo type="button-large">{t('menu.delete')}</Typo>
            </button>
          </>
        ) : (
          <button type="button" onClick={handleClickReportUser}>
            <Typo type="button-large" color="WARNING">
              {t('menu.report')}
            </Typo>
          </button>
        )}
      </BottomMenuDialog>
      {showAlert && (
        <CommonDialog
          visible={!!showAlert}
          onClickClose={handleOnCloseAlert}
          confirmTextColor="WARNING"
          {...showAlert}
        />
      )}
    </>
  );
}

export default PostMoreModal;
