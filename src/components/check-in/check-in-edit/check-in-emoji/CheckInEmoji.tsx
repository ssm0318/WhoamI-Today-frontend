import { EmojiClickData } from 'emoji-picker-react';
import { useRef, useState } from 'react';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import EmojiPicker from '@components/emoji-picker/EmojiPicker';
import { Layout, SvgIcon } from '@design-system';

interface CheckInEmojiProps {
  mood: string | null;
  onDelete: () => void;
  onSelectEmoji: (e: EmojiClickData) => void;
}

function CheckInEmoji({ mood, onDelete, onSelectEmoji }: CheckInEmojiProps) {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const emojiSectionWrapper = useRef<HTMLDivElement>(null);
  const toggleButtonWrapper = useRef<HTMLButtonElement>(null);
  const [pickerTop, setPickerTop] = useState(0);

  const handleClickEmoji = () => {
    if (!emojiSectionWrapper.current) return;
    const { top } = emojiSectionWrapper.current.getBoundingClientRect();
    setPickerTop(top + EMOJI_ICON_SIZE);

    setEmojiPickerVisible((prev) => !prev);
  };

  const handleSelectEmoji = (e: EmojiClickData) => {
    onSelectEmoji(e);
    setEmojiPickerVisible(false);
  };

  return (
    <Layout.FlexRow gap={8} mt={8} alignItems="center" ref={emojiSectionWrapper}>
      <Layout.FlexRow
        alignItems="center"
        justifyContent="center"
        rounded={12}
        outline="GRAY_8"
        w={EMOJI_ICON_SIZE}
        h={EMOJI_ICON_SIZE}
      >
        {mood ? (
          <EmojiItem emojiString={mood} size={24} outline="TRANSPARENT" />
        ) : (
          <>
            {/* FIXME IconButton으로 변경 */}
            <button type="button" onClick={handleClickEmoji} ref={toggleButtonWrapper}>
              <SvgIcon name="add_default" size={24} />
            </button>
          </>
        )}
      </Layout.FlexRow>
      {mood && <DeleteButton onClick={onDelete} />}
      {/* emoji toggle popup */}
      {emojiPickerVisible && (
        <EmojiPicker
          onSelectEmoji={handleSelectEmoji}
          isVisible={emojiPickerVisible}
          setIsVisible={setEmojiPickerVisible}
          toggleButtonRef={toggleButtonWrapper}
          pickerPosition={{
            top: pickerTop,
          }}
        />
      )}
    </Layout.FlexRow>
  );
}

const EMOJI_ICON_SIZE = 44;

export default CheckInEmoji;
