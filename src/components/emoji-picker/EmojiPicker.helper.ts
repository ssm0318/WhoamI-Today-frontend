import { BOTTOM_TABBAR_HEIGHT, EMOJI_PICKER_HEIGHT } from '@constants/layout';
import { EmojiPickerTarget } from '@stores/emojiPicker';

export function getEmojiPickerPosition(
  targetEl: HTMLDivElement,
  pickerHeight = EMOJI_PICKER_HEIGHT.DEFAULT,
): Pick<EmojiPickerTarget, 'top'> {
  const { top, height } = targetEl.getBoundingClientRect();
  const bottomMargin = window.innerHeight - top - height - BOTTOM_TABBAR_HEIGHT;

  if (pickerHeight > bottomMargin) return { top: targetEl.offsetTop - pickerHeight - 10 };
  return { top: targetEl.offsetTop + height + 10 };
}

export function getEmojiPickerHeight(useDefaultHeight = true): number {
  return useDefaultHeight ? 200 : 150;
}
