import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useRef } from 'react';
import { DEFAULT_MARGIN, SCREEN_WIDTH } from '@constants/layout';
import { Layout } from '@design-system';
import useClickOutside from '@hooks/useClickOutside';
import { EMOJI_CATEGORIES } from './EmojiReactionPicker.constants';

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

  // TODO(Gina) selectedEmojis 커스텀 스타일
  console.log(selectedEmojis);

  useClickOutside({ ref: emojiPickerWrapper, onClick: () => setIsVisible(false) });

  if (!isVisible) return null;
  return (
    <Layout.Absolute
      t={pickerPosition.top}
      b={pickerPosition.bottom}
      ref={emojiPickerWrapper}
      l={DEFAULT_MARGIN}
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
        categories={EMOJI_CATEGORIES}
      />
    </Layout.Absolute>
  );
}

export const PICKER_WIDTH = SCREEN_WIDTH - 2 * DEFAULT_MARGIN;
export const PICKER_HEIGHT = 200;

export default EmojiReactionPicker;
