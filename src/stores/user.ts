import { MyProfile } from '@models/api/user';
import { User } from '@models/user';
import { getFriendList } from '@utils/apis/user';
import { BoundState, SliceStateCreator } from './useBoundStore';

interface UserState {
  myProfile: MyProfile | undefined;
  friendList: User[] | undefined;
  isFriendListLoading: boolean;
  fcmToken: string | undefined;
}

interface UserAction {
  setMyProfile: (myProfile: MyProfile) => void;
  updateMyProfile: (myProfileInfo: Partial<MyProfile>) => void;
  resetMyProfile: () => void;
  getFriendList: () => void;
  isUserAuthor: (authorId: number) => boolean;
  setFcmToken: (token: string) => void;
}

export type UserSlice = UserState & UserAction;

const initialState = {
  myProfile: undefined,
  friendList: undefined,
  isFriendListLoading: false,
  fcmToken: undefined,
};

export const createUserSlice: SliceStateCreator<UserSlice> = (set, get) => ({
  ...initialState,
  setMyProfile: (myProfile) => set(() => ({ myProfile }), false, 'user/setMyProfile'),
  updateMyProfile: (myProfileInfo) =>
    set(
      (state) => ({
        myProfile: {
          ...state.myProfile,
          myProfileInfo,
        },
      }),
      false,
      'user/updateMyProfile',
    ),
  resetMyProfile: () => set(initialState),
  getFriendList: async () => {
    set(() => ({ isFriendListLoading: true }));
    const friendList = await getFriendList();
    set(() => ({ friendList: friendList.results }), false, 'user/getFriendList');
    set(() => ({ isFriendListLoading: false }));
  },
  isUserAuthor: (authorId) => get().myProfile?.id === authorId,
  setFcmToken: (fcmToken) => set(() => ({ fcmToken }), false, 'user/setFcmToken'),
});

export const UserSelector = (state: BoundState) => ({
  myProfile: state.myProfile,
  friendList: state.friendList,
  isFriendListLoading: state.isFriendListLoading,
  getFriendList: state.getFriendList,
});
