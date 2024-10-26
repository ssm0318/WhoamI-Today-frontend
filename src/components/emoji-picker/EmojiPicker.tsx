/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactEmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { RefObject, useRef } from 'react';
import { DEFAULT_MARGIN, Z_INDEX } from '@constants/layout';
import { Layout } from '@design-system';
import useClickOutside from '@hooks/useClickOutside';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import { EMOJI_CATEGORIES } from './EmojiPicker.constants';
import { EmojiPickerCustomStyle } from './EmojiPicker.styled';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: EmojiClickData) => void;
  onUnselectEmoji?: (emoji: EmojiClickData) => void;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  toggleButtonRef?: RefObject<HTMLDivElement>;
  selectedEmojis?: string[];
  height?: number;
}

function EmojiPicker({
  onSelectEmoji,
  isVisible,
  setIsVisible,
  toggleButtonRef,
  selectedEmojis,
  height = 200,
  onUnselectEmoji,
}: EmojiPickerProps) {
  const emojiPickerWrapper = useRef<HTMLDivElement>(null);
  const unifiedEmojiList = selectedEmojis?.map((e) => e.codePointAt(0)?.toString(16) || '') || [];
  const { isMobile } = getMobileDeviceInfo();

  useClickOutside({ ref: emojiPickerWrapper, toggleButtonRef, onClick: () => setIsVisible(false) });

  const handleSelectEmoji = (emoji: EmojiClickData, e: MouseEvent) => {
    e.stopPropagation();

    const isAlreadySelected = selectedEmojis?.includes(emoji.emoji);
    if (!isAlreadySelected) {
      onSelectEmoji(emoji);
    } else {
      onUnselectEmoji?.(emoji);
    }
  };

  if (!isVisible) return null;

  console.log(toggleButtonRef?.current?.getBoundingClientRect());

  return (
    <Layout.Absolute
      ref={emojiPickerWrapper}
      l={DEFAULT_MARGIN}
      mt={(toggleButtonRef?.current?.getBoundingClientRect().height ?? 0) + 12}
      z={Z_INDEX.EMOJI_PICKER}
    >
      {selectedEmojis && <EmojiPickerCustomStyle unifiedList={unifiedEmojiList} />}
      <ReactEmojiPicker
        height={height}
        onEmojiClick={handleSelectEmoji}
        autoFocusSearch={false}
        searchDisabled
        previewConfig={{
          showPreview: false,
        }}
        categories={EMOJI_CATEGORIES}
        lazyLoadEmojis
      />
    </Layout.Absolute>
  );
}
export default EmojiPicker;
