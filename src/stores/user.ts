import { MyProfile } from '@models/api/user';
import { User } from '@models/user';
import { getFriendList } from '@utils/apis/user';
import { BoundState, SliceStateCreator } from './useBoundStore';

interface UserState {
  myProfile: MyProfile | undefined;
  friendList: User[] | undefined;
}

interface UserAction {
  setMyProfile: (myProfile: MyProfile) => void;
  resetMyProfile: () => void;
  getFriendList: () => void;
}

export type UserSlice = UserState & UserAction;

const initialState = {
  myProfile: undefined,
  friendList: undefined,
};

export const createUserSlice: SliceStateCreator<UserSlice> = (set) => ({
  ...initialState,
  setMyProfile: (myProfile) => set(() => ({ myProfile }), false, 'user/setMyProfile'),
  resetMyProfile: () => set(initialState),
  getFriendList: async () => {
    const friendList = await getFriendList();
    set(() => ({ friendList }), false, 'user/getFriendList');
  },
});

export const UserSelector = (state: BoundState) => ({
  myProfile: state.myProfile,
  friendList: state.friendList,
  getFriendList: state.getFriendList,
});