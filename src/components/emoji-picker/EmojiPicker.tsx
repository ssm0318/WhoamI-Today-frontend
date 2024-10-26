import ReactEmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useRef } from 'react';
import { DEFAULT_MARGIN, Z_INDEX } from '@constants/layout';
import { Layout } from '@design-system';
import { EMOJI_CATEGORIES } from './EmojiPicker.constants';
import { EmojiPickerCustomStyle } from './EmojiPicker.styled';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: EmojiClickData) => void;
  onUnselectEmoji?: (emoji: EmojiClickData) => void;
  isVisible: boolean;
  selectedEmojis?: string[];
  height?: number;
  left?: number;
  top?: number;
}

function EmojiPicker({
  onSelectEmoji,
  isVisible,
  selectedEmojis,
  height = 200,
  left = DEFAULT_MARGIN,
  top,
  onUnselectEmoji,
}: EmojiPickerProps) {
  const emojiPickerWrapper = useRef<HTMLDivElement>(null);
  const unifiedEmojiList = selectedEmojis?.map((e) => e.codePointAt(0)?.toString(16) || '') || [];

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

  return (
    <Layout.Absolute ref={emojiPickerWrapper} l={left} mt={top ?? 0} z={Z_INDEX.EMOJI_PICKER}>
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
