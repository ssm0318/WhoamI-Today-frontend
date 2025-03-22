import { SliceStateCreator } from './useBoundStore';

export interface EmojiPickerTarget {
  type: 'Note' | 'Response' | 'CheckIn';
  id: number | null;
  direction: 'top' | 'bottom';
}
interface EmojiPickerState {
  emojiPickerTarget: EmojiPickerTarget | null;
}

interface EmojiPickerAction {
  setEmojiPickerTarget: (target: EmojiPickerState['emojiPickerTarget']) => void;
}

const initialState: EmojiPickerState = {
  emojiPickerTarget: null,
};

export type EmojiPickerSlice = EmojiPickerState & EmojiPickerAction;

export const createEmojiPickerSlice: SliceStateCreator<EmojiPickerSlice> = (set) => {
  return {
    ...initialState,
    setEmojiPickerTarget: (target) =>
      set(() => ({ emojiPickerTarget: target }), false, 'emojiPicker/setEmojiPickerTarget'),
  };
};
