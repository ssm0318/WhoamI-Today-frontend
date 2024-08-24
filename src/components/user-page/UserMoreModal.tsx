import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomMenuDialog } from '@components/_common/alert-dialog/bottom-menu-dialog/BottomMenuDialog';
import CommonDialog, {
  CommonDialogProps,
} from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import { Typo } from '@design-system';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { addFriendToFavorite, deleteFavorite } from '@utils/apis/friends';
import { breakFriend, reportUser } from '@utils/apis/user';

interface UserMoreModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  user: UserProfile;
  callback?: () => Promise<void>;
}

type AlertProps = Pick<CommonDialogProps, 'title' | 'content' | 'confirmText' | 'onClickConfirm'>;

function UserMoreModal({ isVisible, setIsVisible, user, callback }: UserMoreModalProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page.more_modal' });
  const [showAlert, setShowAlert] = useState<AlertProps>();

  const { id, username, are_friends, is_favorite } = user;

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const closeMoreModal = () => {
    setIsVisible(false);
  };

  const handleOnCloseAlert = () => setShowAlert(undefined);
  const handleOnConfirmAlert = () => {
    handleOnCloseAlert();
    closeMoreModal();
  };

  const handleClickAddToFavorite = async () => {
    closeMoreModal();

    if (is_favorite) await deleteFavorite(id);
    else await addFriendToFavorite(id);

    callback?.();
  };

  const handleClickManageFriendGroups = () => {
    // TODO
    closeMoreModal();
  };

  const handleClickUnfriend = () => {
    setShowAlert({
      title: t('alert.unfriend.title', { username }),
      content: t('alert.unfriend.content'),
      confirmText: t('menu.unfriend'),
      onClickConfirm: async () => {
        await breakFriend(user.id);
        callback?.();
        handleOnConfirmAlert();
      },
    });
    closeMoreModal();
  };

  const handleClickBlockUser = () => {
    setShowAlert({
      title: t('alert.block.title', { username }),
      content: t('alert.block.content'),
      confirmText: t('menu.block'),
      onClickConfirm: async () => {
        // NOTE: 현재는 차단이 신고와 동일함
        await reportUser({
          userId: user.id,
          onSuccess: () => {
            openToast({ message: t('prompts.sent_success') });
          },
          onError: () => openToast({ message: t('error.temporary_error') }),
        });
        callback?.();
        handleOnConfirmAlert();
      },
    });
    closeMoreModal();
  };

  const handleClickReportUser = () => {
    setShowAlert({
      title: t('alert.report.title', { username }),
      content: t('alert.report.content'),
      confirmText: t('menu.block'),
      onClickConfirm: async () => {
        await reportUser({
          userId: user.id,
          onSuccess: () => {
            openToast({ message: t('prompts.sent_success') });
          },
          onError: () => openToast({ message: t('error.temporary_error') }),
        });
        callback?.();
        handleOnConfirmAlert();
      },
    });
    closeMoreModal();
  };

  return (
    <>
      <BottomMenuDialog visible={isVisible} onClickClose={closeMoreModal}>
        {are_friends && (
          <>
            <button type="button" onClick={handleClickAddToFavorite}>
              <Typo type="button-large" color="DARK_GRAY">
                {is_favorite ? t('menu.remove_from_favorite') : t('menu.add_to_favorite')}
              </Typo>
            </button>
            <button type="button" onClick={handleClickManageFriendGroups}>
              <Typo type="button-large" color="DARK_GRAY">
                {t('menu.manage_friend_groups')}
              </Typo>
            </button>
            <button type="button" onClick={handleClickUnfriend}>
              <Typo type="button-large" color="WARNING">
                {t('menu.unfriend')}
              </Typo>
            </button>
          </>
        )}
        <button type="button" onClick={handleClickBlockUser}>
          <Typo type="button-large" color="WARNING">
            {t('menu.block')}
          </Typo>
        </button>
        <button type="button" onClick={handleClickReportUser}>
          <Typo type="button-large" color="WARNING">
            {t('menu.report')}
          </Typo>
        </button>
      </BottomMenuDialog>
      {showAlert && (
        <CommonDialog
          visible={!!showAlert}
          onClickClose={handleOnCloseAlert}
          confirmTextColor="WARNING"
          cancelText={t('alert.cancel')}
          {...showAlert}
        />
      )}
    </>
  );
}

export default UserMoreModal;
