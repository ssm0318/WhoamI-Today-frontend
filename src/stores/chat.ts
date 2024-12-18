import { ChatRoom } from '@models/api/chat';
import { FetchState } from '@models/api/common';
import { sliceResetFns } from './resetSlices';
import { SliceStateCreator } from './useBoundStore';

interface ChatState {
  chatRoomList: FetchState<ChatRoom[]>;
}
interface ChatAction {
  setChatRoomList: (chatRoomList: FetchState<ChatRoom[]>) => void;
}

const initialState: ChatState = {
  chatRoomList: { state: 'loading' },
};

export type ChatSlice = ChatState & ChatAction;

export const createChatSlice: SliceStateCreator<ChatSlice> = (set) => {
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    setChatRoomList: (chatRoomList) => {
      set(() => ({ chatRoomList }), false, 'chat/setChatRoomList');
    },
  };
};
