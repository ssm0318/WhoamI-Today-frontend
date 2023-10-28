import { EmojiClickData } from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import Divider from '@components/_common/divider/Divider';
import Calendar from '@components/calendar/Calendar';
import CalendarViewTabs from '@components/calendar/calendar-view-Tabs/CalendarViewTabs';
import TodaysMoments from '@components/home/todays-moments/TodaysMoments';
import MyDetail from '@components/my-detail/MyDetail';
import MyProfile from '@components/my-profile/MyProfile';
import EmojiReactionPicker from '@components/reaction/emoji-reaction-picker/EmojiReactionPicker';
import { SCREEN_HEIGHT, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { Font, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

function My() {
  const { resetDetailDate, detailDate } = useBoundStore((state) => ({
    resetDetailDate: state.resetDetailDate,
    detailDate: state.detailDate,
  }));

  const [emojis, setEmojis] = useState<string[]>([]);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const reactionSectionWrapper = useRef<HTMLDivElement>(null);
  const [pickerPosition, setPickerPosition] = useState<{ top?: number; bottom?: number }>({});

  const handleSelectEmoji = (emoji: EmojiClickData) => {
    setEmojis([...emojis, emoji.emoji]);
  };

  const handleClickReaction = () => {
    setEmojiPickerVisible(true);
    if (!reactionSectionWrapper.current) return;
    console.log(SCREEN_HEIGHT);
    console.log(TOP_NAVIGATION_HEIGHT);

    const { top, height } = reactionSectionWrapper.current.getBoundingClientRect();
    console.log('top', top);
    // setPickerPosition();

    if (top - TOP_NAVIGATION_HEIGHT > SCREEN_HEIGHT / 2) {
      setPickerPosition({ bottom: height / 2 });
    } else {
      setPickerPosition({ top: height });
    }
  };

  useEffect(() => {
    return () => resetDetailDate();
  }, [resetDetailDate]);

  return (
    <Layout.FlexCol w="100%" h="100vh" pt={20} bgColor="BACKGROUND_COLOR">
      <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between" ph={24} pb={14}>
        <MyProfile />
        <CalendarViewTabs />
      </Layout.FlexRow>
      <Calendar />
      <MyDetail detailDate={detailDate} />

      <Layout.FlexCol w="100%" justifyContent="flex-start" h="100vh" bgColor="BASIC_WHITE">
        <TodaysMoments />
        <Layout.FlexCol
          ph="default"
          pv={8}
          outline="BASIC_BLACK"
          w="100%"
          ref={reactionSectionWrapper}
          style={{
            position: 'relative',
          }}
        >
          <button type="button" onClick={handleClickReaction}>
            <Font.Body type="14_semibold">😊</Font.Body>
          </button>
          <EmojiReactionPicker
            selectedEmojis={emojis}
            onSelectEmoji={handleSelectEmoji}
            isVisible={emojiPickerVisible}
            setIsVisible={setEmojiPickerVisible}
            pickerPosition={pickerPosition}
          />
        </Layout.FlexCol>
        <Divider width={1000} />
        <Layout.FlexCol
          ph="default"
          pv={8}
          outline="BASIC_BLACK"
          w="100%"
          ref={reactionSectionWrapper}
          style={{
            position: 'relative',
          }}
        >
          <button type="button" onClick={handleClickReaction}>
            <Font.Body type="14_semibold">😊</Font.Body>
          </button>
          <EmojiReactionPicker
            selectedEmojis={emojis}
            onSelectEmoji={handleSelectEmoji}
            isVisible={emojiPickerVisible}
            setIsVisible={setEmojiPickerVisible}
            pickerPosition={pickerPosition}
          />
        </Layout.FlexCol>
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default My;
