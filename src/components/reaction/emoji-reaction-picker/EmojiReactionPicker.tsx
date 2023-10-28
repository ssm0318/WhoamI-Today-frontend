import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useRef } from 'react';
import { DEFAULT_MARGIN, SCREEN_WIDTH } from '@constants/layout';
import { Layout } from '@design-system';
import useClickOutside from '@hooks/useClickOutside';

interface EmojiReactionPickerProps {
  selectedEmojis: string[];
  onSelectEmoji: (emoji: EmojiClickData) => void;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  pickerPosition: { top?: number; bottom?: number };
}

function EmojiReactionPicker({
  selectedEmojis,
  onSelectEmoji,
  isVisible,
  setIsVisible,
  pickerPosition,
}: EmojiReactionPickerProps) {
  const emojiPickerWrapper = useRef<HTMLDivElement>(null);
  console.log(selectedEmojis);

  useClickOutside({ ref: emojiPickerWrapper, onClick: () => setIsVisible(false) });

  if (!isVisible) return null;
  return (
    <Layout.Absolute
      outline="CALENDAR_TODAY"
      t={pickerPosition.top}
      b={pickerPosition.bottom}
      ref={emojiPickerWrapper}
    >
      <EmojiPicker
        width={PICKER_WIDTH}
        height={PICKER_HEIGHT}
        onEmojiClick={onSelectEmoji}
        autoFocusSearch={false}
        searchDisabled
        previewConfig={{
          showPreview: false,
        }}
      />
    </Layout.Absolute>
  );
}

export const PICKER_WIDTH = SCREEN_WIDTH - 2 * DEFAULT_MARGIN;
export const PICKER_HEIGHT = 200;

export default EmojiReactionPicker;
