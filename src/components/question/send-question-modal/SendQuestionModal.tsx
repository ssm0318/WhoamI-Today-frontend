import { useCallback, useState } from 'react';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Font, Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { User } from '@models/user';
import { getFriendList } from '@utils/apis/user';
import SendQuestionFriendItem from '../send-question-friend-item/SendQuestionFriendItem';

type SendQuestionModalProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

function SendQuestionModal({ isVisible, setIsVisible }: SendQuestionModalProps) {
  const [friendList, setFriendList] = useState<User[]>();
  const [selectedIdList, setSelectedIdList] = useState<number[]>([]);

  const handleConfirm = () => {
    // TODO 질문 보내기 동작
    console.log(selectedIdList);
    setIsVisible(false);
  };

  const handleOnClose = () => {
    setIsVisible(false);
  };

  const handleToggleItem = (userId: number, selected: boolean) => {
    if (selected) {
      setSelectedIdList((prev) => prev.filter((id) => id !== userId));
    } else {
      setSelectedIdList((prev) => [...prev, userId]);
    }
  };

  const updateFriendList = useCallback(async () => {
    const result = await getFriendList();
    setFriendList(result);
  }, []);

  useAsyncEffect(updateFriendList, [updateFriendList]);

  return (
    <BottomModal visible={isVisible} onClose={handleOnClose}>
      <Layout.LayoutBase
        w="100%"
        bgColor="BASIC_WHITE"
        pt={12}
        ph={10}
        pb={12 + BOTTOM_BUTTON_SECTION_HEIGHT}
      >
        {/* TODO: 친구가 없는 유저의 경우 대응 */}
        {friendList?.map((user) => (
          <SendQuestionFriendItem
            user={user}
            onToggle={(selected) => handleToggleItem(user.id, selected)}
            key={user.id}
          />
        ))}
        <Layout.Absolute
          b={0}
          l={0}
          w="100%"
          bgColor="BASIC_WHITE"
          h={BOTTOM_BUTTON_SECTION_HEIGHT}
        >
          <Layout.FlexRow w="100%" pv={13} mh={45} bgColor="BASIC_WHITE">
            <Layout.FlexRow
              bgColor="GRAY_2"
              onClick={handleConfirm}
              w="100%"
              justifyContent="center"
              rounded={14}
              pv={13}
              ph={126}
            >
              <Font.Display type="24_bold">ask</Font.Display>
            </Layout.FlexRow>
          </Layout.FlexRow>
        </Layout.Absolute>
      </Layout.LayoutBase>
    </BottomModal>
  );
}

const BOTTOM_BUTTON_SECTION_HEIGHT = 86;

export default SendQuestionModal;
