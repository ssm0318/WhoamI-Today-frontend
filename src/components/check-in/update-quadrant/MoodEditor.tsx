import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useCallback } from 'react';
import styled from 'styled-components';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import { Colors, Layout, Typo } from '@design-system';
import { ComponentVisibility } from '@models/checkIn';
import EditorPopup from './EditorPopup';

const MAX_MOOD_EMOJIS = 5;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
  value: string[];
  onChange: (value: string[]) => void;
  visibility: ComponentVisibility;
  onVisibilityChange: (v: ComponentVisibility) => void;
}

export default function MoodEditor({
  isOpen,
  onClose,
  onShare,
  value,
  onChange,
  visibility,
  onVisibilityChange,
}: Props) {
  const handleEmojiClick = useCallback(
    (emojiData: EmojiClickData) => {
      if (value.length >= MAX_MOOD_EMOJIS) return;
      onChange([...value, emojiData.emoji]);
    },
    [onChange, value],
  );

  const handleRemoveEmoji = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [onChange, value],
  );

  return (
    <EditorPopup isOpen={isOpen} onClose={onClose} onShare={onShare} title="Mood">
      <Layout.FlexCol w="100%" alignItems="center" gap={12} mb={16}>
        {value.length > 0 ? (
          <Layout.FlexCol w="100%" gap={8} alignItems="center">
            <Layout.FlexRow gap={8} alignItems="center" justifyContent="center">
              {value.map((emoji, idx) => {
                const handleRemove = () => handleRemoveEmoji(idx);
                return (
                  <EmojiChip
                    key={`${emoji}${value.slice(0, idx).filter((e) => e === emoji).length}`}
                    onClick={handleRemove}
                  >
                    <span style={{ fontSize: 28, lineHeight: 1 }}>{emoji}</span>
                    <RemoveX>x</RemoveX>
                  </EmojiChip>
                );
              })}
            </Layout.FlexRow>
            <Typo type="label-small" color="MEDIUM_GRAY">
              {value.length}/{MAX_MOOD_EMOJIS} selected. Tap emoji to remove.
            </Typo>
          </Layout.FlexCol>
        ) : (
          <Typo type="body-medium" color="MEDIUM_GRAY">
            Pick up to {MAX_MOOD_EMOJIS} emojis
          </Typo>
        )}
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          width="100%"
          height={250}
          searchDisabled
          skinTonesDisabled
          previewConfig={{ showPreview: false }}
        />
      </Layout.FlexCol>
      <VisibilityToggle value={visibility} onChange={onVisibilityChange} />
    </EditorPopup>
  );
}

const EmojiChip = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${Colors.LIGHT_GRAY};
  }
`;

const RemoveX = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${Colors.MEDIUM_GRAY};
  color: white;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;
