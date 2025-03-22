import { BOTTOM_TABBAR_HEIGHT, EMOJI_PICKER_HEIGHT } from '@constants/layout';
import { EmojiPickerTarget } from '@stores/emojiPicker';

export function getEmojiPickerDirection(
  targetEl: HTMLDivElement | null | undefined,
  pickerHeight = EMOJI_PICKER_HEIGHT.DEFAULT,
): EmojiPickerTarget['direction'] {
  if (!targetEl) return 'bottom';
  const { top, height } = targetEl.getBoundingClientRect();
  const bottomMargin = window.innerHeight - top - height - BOTTOM_TABBAR_HEIGHT;

  if (pickerHeight > bottomMargin) return 'top';
  return 'bottom';
}

export function getEmojiPickerHeight(useDefaultHeight = true): number {
  return useDefaultHeight ? 200 : 150;
}
