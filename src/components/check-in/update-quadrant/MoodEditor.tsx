import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import { EMOJI_CATEGORIES } from '@components/emoji-picker/EmojiPicker.constants';
import { Colors, Layout, Typo } from '@design-system';
import { ComponentVisibility } from '@models/checkIn';
import { useBoundStore } from '@stores/useBoundStore';
import { getUnifiedEmoji } from '@utils/emojiHelpers';
import {
  getLastVisibility,
  setLastVisibility,
  VisibilityMemoryKeys,
} from '@utils/visibilityMemory';
import EditorPopup from './EditorPopup';

const MAX_MOOD_EMOJIS = 5;

const MoodEmojiHighlight = createGlobalStyle<{ selectedEmojis: string[] }>`
  ${({ selectedEmojis }) =>
    selectedEmojis.map(
      (emoji) => `
      .comment-emoji-picker [data-unified='${getUnifiedEmoji(emoji)}'] {
        background-color: #C8EEFF !important;
        border-radius: 50% !important;
      }
    `,
    )}
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onShare: (value: string[], visibility: ComponentVisibility) => void;
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
  const [draftValue, setDraftValue] = useState<string[]>(value);
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));
  const [draftVisibility, setDraftVisibility] = useState<ComponentVisibility>(
    () => getLastVisibility(VisibilityMemoryKeys.checkInMood) ?? visibility,
  );

  const handleVisibilityChange = useCallback((v: ComponentVisibility) => {
    setDraftVisibility(v);
    setLastVisibility(VisibilityMemoryKeys.checkInMood, v);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setDraftValue(value);
      setDraftVisibility(getLastVisibility(VisibilityMemoryKeys.checkInMood) ?? visibility);
    } else {
      setDraftValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const draftValueRef = useRef(draftValue);
  draftValueRef.current = draftValue;

  const openToastRef = useRef(openToast);
  openToastRef.current = openToast;

  const handleEmojiClick = useCallback((emojiData: EmojiClickData) => {
    const prev = draftValueRef.current;
    const existing = prev.indexOf(emojiData.emoji);
    if (existing >= 0) {
      setDraftValue(prev.filter((_, i) => i !== existing));
      return;
    }
    if (prev.length >= MAX_MOOD_EMOJIS) {
      openToastRef.current({ message: `You can select up to ${MAX_MOOD_EMOJIS} emojis` });
      return;
    }
    setDraftValue([...prev, emojiData.emoji]);
  }, []);

  const handleRemoveEmoji = useCallback((index: number) => {
    setDraftValue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleShare = useCallback(() => {
    onChange(draftValue);
    onVisibilityChange(draftVisibility);
    onShare(draftValue, draftVisibility);
  }, [draftValue, draftVisibility, onChange, onVisibilityChange, onShare]);

  return (
    <EditorPopup isOpen={isOpen} onClose={onClose} onShare={handleShare} title="Mood">
      <Layout.FlexCol w="100%" alignItems="center" gap={12} mb={16}>
        {draftValue.length > 0 ? (
          <Layout.FlexCol w="100%" gap={8} alignItems="center">
            <Layout.FlexRow gap={8} alignItems="center" justifyContent="center">
              {draftValue.map((emoji, idx) => {
                const handleRemove = () => handleRemoveEmoji(idx);
                return (
                  <EmojiChip
                    key={`${emoji}${draftValue.slice(0, idx).filter((e) => e === emoji).length}`}
                    onClick={handleRemove}
                  >
                    <span style={{ fontSize: 28, lineHeight: 1 }}>{emoji}</span>
                    <RemoveX>x</RemoveX>
                  </EmojiChip>
                );
              })}
            </Layout.FlexRow>
            <Typo type="label-small" color="MEDIUM_GRAY">
              {draftValue.length}/{MAX_MOOD_EMOJIS} selected. Tap emoji to remove.
            </Typo>
          </Layout.FlexCol>
        ) : (
          <Typo type="body-medium" color="MEDIUM_GRAY">
            Pick up to {MAX_MOOD_EMOJIS} emojis
          </Typo>
        )}
        <MoodEmojiHighlight selectedEmojis={draftValue} />
        <div
          style={{
            width: '100%',
            borderRadius: 12,
            border: '1px solid #E0E0E0',
            overflow: 'hidden',
          }}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width="100%"
            height={350}
            skinTonesDisabled
            autoFocusSearch={false}
            searchPlaceHolder="Search emoji"
            previewConfig={{ showPreview: false }}
            categories={EMOJI_CATEGORIES}
            lazyLoadEmojis
            className="comment-emoji-picker mood-emoji-picker"
            style={
              {
                '--epr-emoji-size': '28px',
                '--epr-emoji-padding': '10px',
                '--epr-search-input-height': '46px',
                '--epr-header-padding': '8px var(--epr-horizontal-padding)',
              } as CSSProperties
            }
          />
        </div>
      </Layout.FlexCol>
      <VisibilityToggle value={draftVisibility} onChange={handleVisibilityChange} />
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
