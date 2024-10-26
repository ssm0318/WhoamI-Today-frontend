import ReactEmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { DEFAULT_MARGIN, Z_INDEX } from '@constants/layout';
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
  height = 200,
  left = DEFAULT_MARGIN,
  top,
  onUnselectEmoji,
  post,
}: EmojiPickerProps) {
  const { activeTarget, setActiveTarget } = useBoundStore((state) => ({
    activeTarget: state.activeTarget,
    setActiveTarget: state.setActiveTarget,
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

    setActiveTarget(null);
  };

  const emojiPickerWrapper = useDetectOutsideClick({
    callback: () => {
      setActiveTarget(null);
    },
    enabled: !!(activeTarget && activeTarget.type === 'CheckIn'),
  });

  const isVisible =
    activeTarget &&
    (activeTarget.type === 'CheckIn' ||
      (activeTarget.type === post?.type && activeTarget.id === post?.id));

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
