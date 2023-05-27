import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Layout } from '@design-system';

type SendQuestionModalProps = {
  userList: { id: number; profile_pic: string; name: string }[];
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

function SendQuestionModal({ userList, isVisible, setIsVisible }: SendQuestionModalProps) {
  // const handleConfirm = () => {
  //   console.log(userList);
  // };
  // const handleSkip = () => {
  //   setIsVisible(false);
  // };

  const handleOnClose = () => {
    setIsVisible(false);
  };

  return (
    <BottomModal visible={isVisible} onClose={handleOnClose} height={100}>
      <Layout.LayoutBase w="100%" bgColor="BASIC_WHITE" pv={12} ph={10}>
        {userList.map((user) => (
          <Layout.LayoutBase h={20} key={user.id}>
            {user.name}
          </Layout.LayoutBase>
        ))}
      </Layout.LayoutBase>
    </BottomModal>
  );
}

export default SendQuestionModal;
