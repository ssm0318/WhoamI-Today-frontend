import { ChatRoom } from '@models/api/chat';
import { SliceStateCreator } from './useBoundStore';

interface ChatState {
  chatRoomList: ChatRoom[];
}
interface ChatAction {
  findChatRoom: (roomId: string) => ChatRoom | undefined;
  setChatRoomList: (chatRoomList: ChatRoom[]) => void;
}

const initialState = {
  chatRoomList: [],
};

export type ChatSlice = ChatState & ChatAction;

export const createChatSlice: SliceStateCreator<ChatSlice> = (set, get) => ({
  ...initialState,
  findChatRoom: (roomId: string) => {
    return get().chatRoomList.find(({ id }) => id.toString() === roomId);
  },
  setChatRoomList: (chatRoomList) => {
    set(() => ({
      chatRoomList,
    }));
  },
});
