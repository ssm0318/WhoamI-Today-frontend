import { SliceStateCreator } from './useBoundStore';

interface EmojiPickerState {
  activeTarget: {
    type: 'Note' | 'Response' | 'CheckIn';
    id: number | null;
  } | null;
}

interface EmojiPickerAction {
  setActiveTarget: (target: EmojiPickerState['activeTarget']) => void;
  closeEmojiPicker: () => void;
}

const initialState: EmojiPickerState = {
  activeTarget: null,
};

export type EmojiPickerSlice = EmojiPickerState & EmojiPickerAction;

export const createEmojiPickerSlice: SliceStateCreator<EmojiPickerSlice> = (set) => {
  return {
    ...initialState,
    setActiveTarget: (target) =>
      set(() => ({ activeTarget: target }), false, 'emojiPicker/setActiveTarget'),
    closeEmojiPicker: () =>
      set(() => ({ activeTarget: null }), false, 'emojiPicker/closeEmojiPicker'),
  };
};
