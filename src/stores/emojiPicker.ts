import { SliceStateCreator } from './useBoundStore';

interface EmojiPickerState {
  emojiPickerTarget: {
    type: 'Note' | 'Response' | 'CheckIn';
    id: number | null;
  } | null;
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
