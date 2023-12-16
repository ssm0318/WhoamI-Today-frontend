import { EmojiClickData } from 'emoji-picker-react';
import { RefObject, useRef, useState } from 'react';
import { SCREEN_HEIGHT, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { Font, Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { ReactionPostType } from '@models/post';
import { getReactionList, postReaction } from '@utils/apis/responses';
import EmojiReactionList from '../emoji-reaction-list/EmojiReactionList';
import EmojiReactionPicker from '../emoji-reaction-picker/EmojiReactionPicker';
import EmojiViewPopup from '../emoji-view-popup/EmojiViewPopup';

interface ReactionSectionProps {
  postType: ReactionPostType;
  postId: number;
}

interface Position {
  top?: number;
  bottom?: number;
}

function ReactionSection({ postType, postId }: ReactionSectionProps) {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [emojiViewPopupVisible, setEmojiViewPopupVisible] = useState(false);
  const reactionSectionWrapper = useRef<HTMLDivElement>(null);
  const [pickerPosition, setPickerPosition] = useState<Position>({});
  const [popupPosition, setPopupPosition] = useState<Position>({});
  const [reactionEmojis, setReactionEmojis] = useState<string[]>([]);

  const toggleButtonRef = useRef<HTMLButtonElement>(null); // 토글 버튼의 Ref 생성

  const handlePosition = (wrapper: RefObject<HTMLElement>): Position => {
    if (!wrapper.current) return {};
    const { top, height } = wrapper.current.getBoundingClientRect();
    if (top - TOP_NAVIGATION_HEIGHT > SCREEN_HEIGHT / 2) {
      return { bottom: height };
    }
    return { top: height };
  };

  const handleClickReaction = () => {
    const { bottom, top } = handlePosition(reactionSectionWrapper);
    setPickerPosition({ bottom, top });

    setEmojiPickerVisible(!emojiPickerVisible);
  };

  const handleSelectEmoji = async (emoji: EmojiClickData) => {
    await postReaction(postType, postId, emoji.emoji);
  };

  const handleClickViewAllEmoji = () => {
    const { bottom, top } = handlePosition(reactionSectionWrapper);
    setPopupPosition({ bottom, top });

    setEmojiViewPopupVisible(!emojiViewPopupVisible);
  };

  useAsyncEffect(async () => {
    const { results } = await getReactionList(postType, postId);
    setReactionEmojis(results?.map((r) => r.emoji).slice(0, 5) || []);
  }, []);

  return (
    <Layout.FlexRow
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      ph="default"
      pv={8}
      outline="BLACK"
      ref={reactionSectionWrapper}
      style={{
        position: 'relative',
      }}
    >
      {/* 리액션 이모지 리스트 */}
      {/* NOTE: author는 모든 리액션 리스트, viewer는 자기의 리액션 리스트 */}
      <Layout.FlexRow gap={4} alignItems="center">
        <EmojiReactionList emojis={reactionEmojis} />
        <button type="button" onClick={handleClickViewAllEmoji}>
          <Font.Body type="14_semibold" underline>
            See All
          </Font.Body>
        </button>
        <EmojiViewPopup
          isVisible={emojiViewPopupVisible}
          setIsVisible={setEmojiViewPopupVisible}
          popupPosition={popupPosition}
        />
      </Layout.FlexRow>

      <Layout.FlexRow gap={4}>
        {/* 이모지 리액션 */}
        <Layout.FlexCol w="100%">
          <button type="button" onClick={handleClickReaction} ref={toggleButtonRef}>
            <Font.Body type="14_semibold">😊</Font.Body>
          </button>
          <EmojiReactionPicker
            selectedEmojis={reactionEmojis}
            onSelectEmoji={handleSelectEmoji}
            isVisible={emojiPickerVisible}
            setIsVisible={setEmojiPickerVisible}
            pickerPosition={pickerPosition}
            toggleButtonRef={toggleButtonRef}
          />
        </Layout.FlexCol>
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default ReactionSection;
