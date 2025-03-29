import ReactEmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
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
  post?: Response | Note;
  createPortalId?: string;
}

function EmojiPicker({
  onSelectEmoji,
  selectedEmojis,
  height = EMOJI_PICKER_HEIGHT.DEFAULT,
  left = DEFAULT_MARGIN,
  onUnselectEmoji,
  post,
  createPortalId,
}: EmojiPickerProps) {
  const { emojiPickerTarget, setEmojiPickerTarget } = useBoundStore((state) => ({
    emojiPickerTarget: state.emojiPickerTarget,
    setEmojiPickerTarget: state.setEmojiPickerTarget,
  }));

  const handleSelectEmoji = useCallback(
    (emoji: EmojiClickData, e: MouseEvent) => {
      e.stopPropagation();

      const isAlreadySelected = selectedEmojis?.includes(emoji.emoji);
      if (!isAlreadySelected) {
        onSelectEmoji(emoji);
      } else {
        onUnselectEmoji?.(emoji);
      }

      setEmojiPickerTarget(null);
    },
    [onSelectEmoji, onUnselectEmoji, selectedEmojis, setEmojiPickerTarget],
  );

  const emojiPickerWrapper = useDetectOutsideClick({
    callback: () => {
      setEmojiPickerTarget(null);
    },
    enabled: !!(emojiPickerTarget && emojiPickerTarget.type === 'CheckIn'),
  });

  const content = useMemo(() => {
    const isVisible =
      emojiPickerTarget &&
      (emojiPickerTarget.type === 'CheckIn' ||
        (emojiPickerTarget.type === post?.type && emojiPickerTarget.id === post?.id));

    if (!isVisible) return null;

    const unifiedEmojiList = selectedEmojis?.map((e) => getUnifiedEmoji(e)) || [];

    return (
      <Layout.Absolute
        ref={emojiPickerWrapper}
        l={left}
        t={emojiPickerTarget.top}
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
  }, [
    emojiPickerTarget,
    emojiPickerWrapper,
    handleSelectEmoji,
    height,
    left,
    post?.id,
    post?.type,
    selectedEmojis,
  ]);

  const element = createPortalId ? document.getElementById(createPortalId) : null;

  if (createPortalId && element) {
    return createPortal(content, element);
  }
  return content;
}
export default EmojiPicker;
