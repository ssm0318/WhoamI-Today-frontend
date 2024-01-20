import { ChatRoom } from '@models/api/chat';
import { FetchState } from '@models/api/common';
import { getChatRooms } from '@utils/apis/chat';
import { SliceStateCreator } from './useBoundStore';

interface ChatState {
  chatRoomList: FetchState<ChatRoom[]>;
}
interface ChatAction {
  getChatRoomList: () => void;
}

const initialState: ChatState = {
  chatRoomList: { state: 'loading' },
};

export type ChatSlice = ChatState & ChatAction;

export const createChatSlice: SliceStateCreator<ChatSlice> = (set) => ({
  ...initialState,
  getChatRoomList: async () => {
    try {
      const chatRoomList = await getChatRooms();
      set(
        () => ({ chatRoomList: { state: 'hasValue', data: chatRoomList } }),
        false,
        'chat/getChatRoomList',
      );
    } catch {
      set(() => ({ chatRoomList: { state: 'hasError' } }));
    }
  },
});
