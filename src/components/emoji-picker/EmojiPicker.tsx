import ReactEmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { RefObject, useRef } from 'react';
import { DEFAULT_MARGIN, SCREEN_WIDTH } from '@constants/layout';
import { Layout } from '@design-system';
import useClickOutside from '@hooks/useClickOutside';
import { EMOJI_CATEGORIES } from './EmojiPicker.constants';
import { EmojiPickerCustomStyle } from './EmojiPicker.styled';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: EmojiClickData) => void;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  pickerPosition?: { top?: number; bottom?: number };
  toggleButtonRef?: RefObject<HTMLButtonElement>;
  selectedEmojis?: string[];
}

function EmojiPicker({
  onSelectEmoji,
  isVisible,
  setIsVisible,
  pickerPosition,
  toggleButtonRef,
  selectedEmojis,
}: EmojiPickerProps) {
  const emojiPickerWrapper = useRef<HTMLDivElement>(null);
  const unifiedEmojiList = selectedEmojis?.map((e) => e.codePointAt(0)?.toString(16) || '') || [];

  useClickOutside({ ref: emojiPickerWrapper, toggleButtonRef, onClick: () => setIsVisible(false) });

  if (!isVisible) return null;

  const handleSelectEmoji = (emoji: EmojiClickData) => {
    onSelectEmoji(emoji);
  };

  return (
    <Layout.Absolute
      t={pickerPosition?.top}
      b={pickerPosition?.bottom}
      ref={emojiPickerWrapper}
      l={DEFAULT_MARGIN}
    >
      {selectedEmojis && <EmojiPickerCustomStyle unifiedList={unifiedEmojiList} />}
      <ReactEmojiPicker
        width={SCREEN_WIDTH - 2 * DEFAULT_MARGIN}
        height={200}
        onEmojiClick={handleSelectEmoji}
        autoFocusSearch={false}
        searchDisabled
        previewConfig={{
          showPreview: false,
        }}
        categories={EMOJI_CATEGORIES}
      />
    </Layout.Absolute>
  );
}

export default EmojiPicker;
