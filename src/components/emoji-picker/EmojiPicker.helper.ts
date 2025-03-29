import { BOTTOM_TABBAR_HEIGHT, EMOJI_PICKER_HEIGHT } from '@constants/layout';
import { EmojiPickerTarget } from '@stores/emojiPicker';

export function getEmojiPickerPosition({
  targetEl,
  pickerHeight = EMOJI_PICKER_HEIGHT.DEFAULT,
  bottomAreaHeight = BOTTOM_TABBAR_HEIGHT,
}: {
  targetEl: HTMLDivElement;
  pickerHeight?: number;
  bottomAreaHeight?: number;
}): Pick<EmojiPickerTarget, 'top'> {
  const { top, height } = targetEl.getBoundingClientRect();
  const bottomMargin = window.innerHeight - top - height - bottomAreaHeight;

  if (pickerHeight > bottomMargin) return { top: targetEl.offsetTop - pickerHeight - 10 };
  return { top: targetEl.offsetTop + height + 10 };
}
