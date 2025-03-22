import ReactEmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { DEFAULT_MARGIN, EMOJI_PICKER_HEIGHT, Z_INDEX } from '@constants/layout';
import { Layout } from '@design-system';
import { useDetectOutsideClick } from '@hooks/useDetectOutsideClick';
import { Note, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getUnifiedEmoji } from '@utils/emojiHelpers';
import { EMOJI_CATEGORIES } from './EmojiPicker.constants';
import { EmojiPickerCustomStyle } from './EmojiPicker.styled';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: EmojiClickData) => void;
  onUnselectEmoji?: (emoji: EmojiClickData) => void;
  selectedEmojis?: string[];
  height?: number;
  left?: number;
  top?: number;
  post?: Response | Note;
}

function EmojiPicker({
  onSelectEmoji,
  selectedEmojis,
  height = EMOJI_PICKER_HEIGHT.DEFAULT,
  left = DEFAULT_MARGIN,
  top,
  onUnselectEmoji,
  post,
}: EmojiPickerProps) {
  const { emojiPickerTarget, setEmojiPickerTarget } = useBoundStore((state) => ({
    emojiPickerTarget: state.emojiPickerTarget,
    setEmojiPickerTarget: state.setEmojiPickerTarget,
  }));

  const unifiedEmojiList = selectedEmojis?.map((e) => getUnifiedEmoji(e)) || [];

  const handleSelectEmoji = (emoji: EmojiClickData, e: MouseEvent) => {
    e.stopPropagation();

    const isAlreadySelected = selectedEmojis?.includes(emoji.emoji);
    if (!isAlreadySelected) {
      onSelectEmoji(emoji);
    } else {
      onUnselectEmoji?.(emoji);
    }

    setEmojiPickerTarget(null);
  };

  const emojiPickerWrapper = useDetectOutsideClick({
    callback: () => {
      setEmojiPickerTarget(null);
    },
    enabled: !!(emojiPickerTarget && emojiPickerTarget.type === 'CheckIn'),
  });

  const isVisible =
    emojiPickerTarget &&
    (emojiPickerTarget.type === 'CheckIn' ||
      (emojiPickerTarget.type === post?.type && emojiPickerTarget.id === post?.id));

  if (!isVisible) return null;

  return (
    <Layout.Absolute
      ref={emojiPickerWrapper}
      l={left}
      mt={emojiPickerTarget.direction === 'top' ? -height : top ?? 0}
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
