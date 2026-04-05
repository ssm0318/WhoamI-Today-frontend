import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useCallback } from 'react';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import { Layout, SvgIcon, Typo } from '@design-system';
import { ComponentVisibility } from '@models/checkIn';
import EditorPopup from './EditorPopup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  visibility: ComponentVisibility;
  onVisibilityChange: (v: ComponentVisibility) => void;
}

export default function MoodEditor({
  isOpen,
  onClose,
  value,
  onChange,
  visibility,
  onVisibilityChange,
}: Props) {
  const handleEmojiClick = useCallback(
    (emojiData: EmojiClickData) => {
      onChange(emojiData.emoji);
    },
    [onChange],
  );

  return (
    <EditorPopup isOpen={isOpen} onClose={onClose} title="Mood">
      <Layout.FlexCol w="100%" alignItems="center" gap={12} mb={16}>
        {value ? (
          <Layout.FlexRow gap={12} alignItems="center">
            <EmojiItem emojiString={value} size={48} bgColor="TRANSPARENT" outline="TRANSPARENT" />
            <Layout.FlexRow
              style={{ cursor: 'pointer' }}
              onClick={() => onChange('')}
              alignItems="center"
              gap={4}
            >
              <SvgIcon name="delete_button" size={20} />
              <Typo type="label-medium" color="MEDIUM_GRAY">
                Clear
              </Typo>
            </Layout.FlexRow>
          </Layout.FlexRow>
        ) : (
          <Typo type="body-medium" color="MEDIUM_GRAY">
            Pick an emoji
          </Typo>
        )}
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          width="100%"
          height={280}
          searchDisabled
          skinTonesDisabled
          previewConfig={{ showPreview: false }}
        />
      </Layout.FlexCol>
      <VisibilityToggle value={visibility} onChange={onVisibilityChange} />
    </EditorPopup>
  );
}
