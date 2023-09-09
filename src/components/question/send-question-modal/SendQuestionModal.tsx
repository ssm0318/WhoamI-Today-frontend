import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import NoContents from '@components/_common/no-contents/NoContents';
import { Button, Font, Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { requestResponse } from '@utils/apis/question';
import SendQuestionCompleteModal from '../send-question-complete-modal/SendQuestionCompleteModal';
import SendQuestionFriendItem from '../send-question-friend-item/SendQuestionFriendItem';

type SendQuestionModalProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  questionId: number;
  onSkip?: () => void;
  onSend?: () => void;
};

function SendQuestionModal({
  isVisible,
  setIsVisible,
  questionId,
  onSkip,
  onSend,
}: SendQuestionModalProps) {
  const { myProfile: currentUser, friendList, getFriendList } = useBoundStore(UserSelector);
  const [showComplete, setShowComplete] = useState(false);

  const [selectedIdList, setSelectedIdList] = useState<number[]>([]);
  const [t] = useTranslation('translation');

  const handleConfirm = () => {
    if (!currentUser || !selectedIdList.length) return;
    requestResponse(currentUser.id, questionId, selectedIdList);
    setIsVisible(false);
    setShowComplete(true);
  };

  const handleToggleItem = (userId: number, selected: boolean) => {
    if (!selected) {
      setSelectedIdList((prev) => prev.filter((id) => id !== userId));
    } else {
      setSelectedIdList((prev) => [...prev, userId]);
    }
  };

  useAsyncEffect(async () => {
    if (friendList) return;
    getFriendList();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setSelectedIdList([]);
    }
  }, [isVisible]);

  return (
    <>
      <BottomModal
        visible={isVisible}
        TopComponent={
          <Layout.FlexRow>
            <Button.Small
              type="white_fill"
              status="normal"
              text={t('question.send.skip')}
              onClick={onSkip}
            />
          </Layout.FlexRow>
        }
        onClose={() => setIsVisible(false)}
      >
        <Layout.LayoutBase
          w="100%"
          bgColor="BASIC_WHITE"
          pt={12}
          ph="default"
          pb={12 + BOTTOM_BUTTON_SECTION_HEIGHT}
        >
          {friendList && friendList.length > 0 ? (
            <>
              {friendList.map((user) => (
                <SendQuestionFriendItem
                  user={user}
                  key={user.id}
                  isSelected={selectedIdList.includes(user.id)}
                  setIsSelected={(selected) => handleToggleItem(user.id, selected)}
                />
              ))}
            </>
          ) : (
            <NoContents title={t('no_contents.friends')} bgColor="BASIC_WHITE" />
          )}
          <Layout.Absolute
            b={0}
            l={0}
            w="100%"
            bgColor="BASIC_WHITE"
            h={BOTTOM_BUTTON_SECTION_HEIGHT}
            cursor="pointer"
          >
            <Layout.FlexRow w="100%" pv={13} mh={45} bgColor="BASIC_WHITE">
              <Layout.FlexRow
                bgColor="GRAY_2"
                onClick={handleConfirm}
                w="100%"
                justifyContent="center"
                rounded={14}
                pv={13}
              >
                <Font.Display type="24_bold">{t('question.send.ask')}</Font.Display>
              </Layout.FlexRow>
            </Layout.FlexRow>
          </Layout.Absolute>
        </Layout.LayoutBase>
      </BottomModal>
      <SendQuestionCompleteModal
        isVisible={showComplete}
        setIsVisible={setShowComplete}
        onComplete={() => onSend?.()}
      />
    </>
  );
}

const BOTTOM_BUTTON_SECTION_HEIGHT = 86;

export default SendQuestionModal;
