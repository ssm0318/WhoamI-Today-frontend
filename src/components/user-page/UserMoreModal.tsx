import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Font, Layout } from '@design-system';
import { UserProfile } from '@models/user';

interface UserMoreModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  user?: UserProfile;
}

function UserMoreModal({ isVisible, setIsVisible, user }: UserMoreModalProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });

  const handleOnCloseMore = () => {
    setIsVisible(false);
  };

  const handleOnClickReportUser = () => {
    console.log('TODO');
  };

  const handleOnClickBreakFriends = () => {
    console.log('TODO');
  };

  return (
    <BottomModal visible={isVisible} onClose={handleOnCloseMore}>
      <Layout.FlexCol w="100%" alignItems="center" bgColor="BASIC_WHITE" pt={12} pb={12} gap={16}>
        {/* NOTE: 현재는 차단이 신고와 동일함 */}
        <button type="button" onClick={handleOnClickReportUser}>
          <Font.Body type="20_regular">{t('block_this_user')}</Font.Body>
        </button>
        <button type="button" onClick={handleOnClickReportUser}>
          <Font.Body type="20_regular">{t('report_this_user')}</Font.Body>
        </button>
        {user?.are_friends && (
          <button type="button" onClick={handleOnClickBreakFriends}>
            <Font.Body type="20_regular">{t('break_friends')}</Font.Body>
          </button>
        )}
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default UserMoreModal;
