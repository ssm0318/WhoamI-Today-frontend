import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Font, Layout } from '@design-system';
import { UserProfile } from '@models/user';
import { breakFriend, reportUser } from '@utils/apis/user';
import UserRelatedAlert, { UserRelatedAlertProps } from './UserRelatedAlert';

interface UserMoreModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  user: UserProfile;
  callback?: () => Promise<void>;
}

type Alert = Pick<UserRelatedAlertProps, 'confirmMsg' | 'onClickConfirm'>;

function UserMoreModal({ isVisible, setIsVisible, user, callback }: UserMoreModalProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });
  const [showAlert, setShowAlert] = useState<Alert>();

  const handleOnCloseMore = () => {
    setIsVisible(false);
  };

  const handleOnCloseAlert = () => setShowAlert(undefined);
  const handleOnConfirmAlert = () => {
    handleOnCloseAlert();
    handleOnCloseMore();
  };

  const handleOnClickReportUser = () => {
    setShowAlert({
      onClickConfirm: async () => {
        await reportUser(user.id);
        callback?.();
        handleOnConfirmAlert();
      },
      confirmMsg: t('do_you_want_to_report_this_user'),
    });
  };

  const handleOnClickBlockUser = () => {
    setShowAlert({
      onClickConfirm: async () => {
        // NOTE: 현재는 차단이 신고와 동일함
        await reportUser(user.id);
        callback?.();
        handleOnConfirmAlert();
      },
      confirmMsg: t('do_you_want_to_block_this_user'),
    });
  };

  const handleOnClickBreakFriends = () => {
    setShowAlert({
      onClickConfirm: async () => {
        await breakFriend(user.id);
        callback?.();
        handleOnConfirmAlert();
      },
      confirmMsg: t('are_you_sure_you_want_to_delete_this_friend'),
    });
  };

  return (
    <>
      <BottomModal visible={isVisible} onClose={handleOnCloseMore}>
        <Layout.FlexCol w="100%" alignItems="center" bgColor="BASIC_WHITE" pt={12} pb={12} gap={16}>
          {/* NOTE: 현재는 차단이 신고와 동일함 */}
          <button type="button" onClick={handleOnClickBlockUser}>
            <Font.Body type="20_regular">{t('block_this_user')}</Font.Body>
          </button>
          <button type="button" onClick={handleOnClickReportUser}>
            <Font.Body type="20_regular">{t('report_this_user')}</Font.Body>
          </button>
          {user.are_friends && (
            <button type="button" onClick={handleOnClickBreakFriends}>
              <Font.Body type="20_regular">{t('break_friends')}</Font.Body>
            </button>
          )}
        </Layout.FlexCol>
      </BottomModal>
      {showAlert && (
        <UserRelatedAlert visible={!!showAlert} close={handleOnCloseAlert} {...showAlert} />
      )}
    </>
  );
}

export default UserMoreModal;
