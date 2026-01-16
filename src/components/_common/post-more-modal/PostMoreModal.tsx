import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BottomMenuDialog } from '@components/_common/alert-dialog/bottom-menu-dialog/BottomMenuDialog';
import CommonDialog, {
  CommonDialogProps,
} from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import { Typo } from '@design-system';
import { Note, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { reportContent } from '@utils/apis/common';
import { getMyProfile } from '@utils/apis/my';
import { deleteNote } from '@utils/apis/note';
import { pinPost, unpinPost } from '@utils/apis/pin';
import { deleteResponse } from '@utils/apis/responses';

interface PostMoreModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  post: Note | Response;
  isMyPage?: boolean;
  onConfirmReport?: () => void;
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

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const { current_user_pin_id } = post;

  const navigate = useNavigate();

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
        await reportContent({
          postId: post.id,
          postType: post.type,
          onSuccess: () => {
            openToast({ message: t('report.success_title') });
          },
          onError: () => openToast({ message: t('report.error_title') }),
        });
        onConfirmReport?.();
        handleOnConfirmAlert();
      },
    });
    closeMoreModal();
  };

  const handleClickEditPost = () => {
    if (post.type === 'Note') {
      navigate(`/notes/new`, { state: { post, status: 'edit' } });
    } else if (post.type === 'Response') {
      navigate(`/responses/${post.id}/edit`);
    }
  };

  const handleClickDeletePost = () => {
    setShowAlert({
      title: t('delete.title'),
      content: t('delete.content'),
      confirmText: t('delete.delete'),
      cancelText: t('delete.cancel'),
      onClickConfirm: async () => {
        if (post.type === 'Note') {
          await deleteNote({
            noteId: post.id,
            onSuccess: () => {
              onConfirmReport?.();
              handleOnConfirmAlert();
              openToast({ message: t('delete.success_title') });
            },
            onError: () => openToast({ message: t('delete.error_title') }),
          });
        } else if (post.type === 'Response') {
          await deleteResponse({
            responseId: post.id,
            onSuccess: () => {
              onConfirmReport?.();
              handleOnConfirmAlert();
              openToast({ message: t('delete.success_title') });
            },
            onError: () => openToast({ message: t('delete.error_title') }),
          });
        }
      },
    });
    closeMoreModal();
  };

  const handleClickPinPost = async () => {
    try {
      await pinPost(post.type, post.id);
      // Update user profile to refresh pinned_cnt
      await getMyProfile();
      openToast({ message: t('pin.success_title') });
      onConfirmReport?.();
      closeMoreModal();
    } catch (error) {
      openToast({ message: t('pin.error_title') });
    }
  };

  const handleClickUnpinPost = async () => {
    try {
      if (current_user_pin_id) {
        await unpinPost(current_user_pin_id);
        // Update user profile to refresh pinned_cnt
        await getMyProfile();
        openToast({ message: t('unpin.success_title') });
        onConfirmReport?.();
        closeMoreModal();
      }
    } catch (error) {
      openToast({ message: t('unpin.error_title') });
    }
  };

  return (
    <>
      <BottomMenuDialog visible={isVisible} onClickClose={closeMoreModal}>
        {isMyPage ? (
          <>
            <button type="button" onClick={handleClickEditPost}>
              <Typo type="button-large">{t('menu.edit')}</Typo>
            </button>
            {post.is_pinned ? (
              <button type="button" onClick={handleClickUnpinPost}>
                <Typo type="button-large">{t('menu.unpin')}</Typo>
              </button>
            ) : (
              <button type="button" onClick={handleClickPinPost}>
                <Typo type="button-large">{t('menu.pin')}</Typo>
              </button>
            )}
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
