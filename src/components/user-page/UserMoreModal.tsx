import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomMenuDialog } from '@components/_common/alert-dialog/bottom-menu-dialog/BottomMenuDialog';
import { Typo } from '@design-system';
import { UserProfile } from '@models/user';
import { addFriendToFavorite, deleteFavorite } from '@utils/apis/friends';
import { breakFriend, reportUser } from '@utils/apis/user';
import UserRelatedAlert, { Alert } from './UserRelatedAlert';

interface UserMoreModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  user: UserProfile;
  callback?: () => Promise<void>;
}

function UserMoreModal({ isVisible, setIsVisible, user, callback }: UserMoreModalProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page.more_modal' });
  const [showAlert, setShowAlert] = useState<Alert>();

  const { id, is_favorite } = user;

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

    if (is_favorite) {
      await deleteFavorite(id);
    } else {
      await addFriendToFavorite(id);
    }

    callback?.();
  };

  const handleClickManageFriendGroups = () => {
    // TODO
    closeMoreModal();
  };

  const handleClickUnfriend = () => {
    setShowAlert({
      onClickConfirm: async () => {
        await breakFriend(user.id);
        callback?.();
        handleOnConfirmAlert();
      },
      confirmMsg: t('alert.unfriend.content'),
    });
    closeMoreModal();
  };

  const handleClickBlockUser = () => {
    setShowAlert({
      onClickConfirm: async () => {
        // NOTE: 현재는 차단이 신고와 동일함
        await reportUser(user.id);
        callback?.();
        handleOnConfirmAlert();
      },
      confirmMsg: t('alert.block.content'),
    });
    closeMoreModal();
  };

  const handleClickReportUser = () => {
    setShowAlert({
      onClickConfirm: async () => {
        await reportUser(user.id);
        callback?.();
        handleOnConfirmAlert();
      },
      confirmMsg: t('alert.block.content'),
    });
    closeMoreModal();
  };

  return (
    <>
      <BottomMenuDialog visible={isVisible} onClickClose={closeMoreModal}>
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
        <UserRelatedAlert visible={!!showAlert} close={handleOnCloseAlert} {...showAlert} />
      )}
    </>
  );
}

export default UserMoreModal;
