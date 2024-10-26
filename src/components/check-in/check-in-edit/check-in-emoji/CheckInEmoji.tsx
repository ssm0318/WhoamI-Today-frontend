import { EmojiClickData } from 'emoji-picker-react';
import { useEffect, useRef } from 'react';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import Icon from '@components/_common/icon/Icon';
import EmojiPicker from '@components/emoji-picker/EmojiPicker';
import { Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';

interface CheckInEmojiProps {
  mood: string | null;
  onDelete: () => void;
  onSelectEmoji: (e: EmojiClickData) => void;
}

function CheckInEmoji({ mood, onDelete, onSelectEmoji }: CheckInEmojiProps) {
  const { emojiPickerTarget, setEmojiPickerTarget } = useBoundStore((state) => ({
    emojiPickerTarget: state.emojiPickerTarget,
    setEmojiPickerTarget: state.setEmojiPickerTarget,
  }));
  const toggleButtonRef = useRef<HTMLDivElement>(null);

  const handleClickEmoji = () => {
    if (emojiPickerTarget) {
      return setEmojiPickerTarget(null);
    }
    setEmojiPickerTarget({ type: 'CheckIn', id: null });
  };

  const handleSelectEmoji = (e: EmojiClickData) => {
    onSelectEmoji(e);
    setEmojiPickerTarget(null);
  };

  useEffect(() => {
    return () => {
      setEmojiPickerTarget(null);
    };
  }, [setEmojiPickerTarget]);

  return (
    <Layout.FlexCol w="100%">
      <Layout.FlexRow gap={8} mt={8} alignItems="center">
        <Layout.FlexRow
          alignItems="center"
          justifyContent="center"
          rounded={12}
          outline={emojiPickerTarget ? 'BLACK' : 'LIGHT_GRAY'}
          w={EMOJI_ICON_SIZE}
          h={EMOJI_ICON_SIZE}
        >
          {mood ? (
            <EmojiItem emojiString={mood} size={24} outline="TRANSPARENT" />
          ) : (
            <Icon
              onClick={handleClickEmoji}
              name={emojiPickerTarget ? 'add_reaction_active' : 'add_reaction_default'}
              size={24}
            />
          )}
        </Layout.FlexRow>
        {mood && <DeleteButton onClick={onDelete} size={32} />}
      </Layout.FlexRow>
      {/* emoji toggle popup */}
      <EmojiPicker
        onSelectEmoji={handleSelectEmoji}
        top={(toggleButtonRef.current?.getBoundingClientRect().height ?? 0) + 12}
      />
    </Layout.FlexCol>
  );
}

const EMOJI_ICON_SIZE = 44;

export default CheckInEmoji;
