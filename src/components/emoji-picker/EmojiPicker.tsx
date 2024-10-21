import ReactEmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { RefObject, useRef } from 'react';
import { DEFAULT_MARGIN, Z_INDEX } from '@constants/layout';
import { Layout } from '@design-system';
import useClickOutside from '@hooks/useClickOutside';
import { EMOJI_CATEGORIES } from './EmojiPicker.constants';
import { EmojiPickerCustomStyle } from './EmojiPicker.styled';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: EmojiClickData) => void;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  toggleButtonRef?: RefObject<HTMLDivElement>;
  selectedEmojis?: string[];
}

function EmojiPicker({
  onSelectEmoji,
  isVisible,
  setIsVisible,
  toggleButtonRef,
  selectedEmojis,
}: EmojiPickerProps) {
  const emojiPickerWrapper = useRef<HTMLDivElement>(null);
  const unifiedEmojiList = selectedEmojis?.map((e) => e.codePointAt(0)?.toString(16) || '') || [];

  useClickOutside({ ref: emojiPickerWrapper, toggleButtonRef, onClick: () => setIsVisible(false) });

  if (!isVisible) return null;

  const handleSelectEmoji = (emoji: EmojiClickData, e: MouseEvent) => {
    e.stopPropagation();
    onSelectEmoji(emoji);
  };

  return (
    <Layout.Absolute
      ref={emojiPickerWrapper}
      l={DEFAULT_MARGIN}
      mt={(toggleButtonRef?.current?.getBoundingClientRect().height ?? 0) + 12}
      z={Z_INDEX.EMOJI_PICKER}
    >
      {selectedEmojis && <EmojiPickerCustomStyle unifiedList={unifiedEmojiList} />}
      <ReactEmojiPicker
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
