import { FEATURE_FLAG_MAP_COLLECTION, FeatureFlagMap } from '@constants/featureFlag';
import { FetchState } from '@models/api/common';
import { MyProfile, VersionType } from '@models/api/user';
import { User } from '@models/user';
import { getFriendList } from '@utils/apis/user';
import { sliceResetFns } from './resetSlices';
import { BoundState, SliceStateCreator } from './useBoundStore';

interface UserState {
  myProfile: MyProfile | undefined;
  friendList: FetchState<User[]>;
  fcmToken: string | undefined;
  featureFlags: FeatureFlagMap | undefined;
}

interface UserAction {
  setMyProfile: (myProfile: MyProfile) => void;
  updateMyProfile: (myProfileInfo: Partial<MyProfile>) => void;
  resetMyProfile: () => void;
  getFriendList: () => void;
  isUserAuthor: (authorId: number) => boolean;
  setFcmToken: (token: string) => void;
  setFeatureFlags: () => void;
}

export type UserSlice = UserState & UserAction;

const initialState: UserState = {
  myProfile: undefined,
  friendList: { state: 'loading' },
  fcmToken: undefined,
  featureFlags: undefined,
};

export const createUserSlice: SliceStateCreator<UserSlice> = (set, get) => {
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    setMyProfile: (myProfile) => set(() => ({ myProfile }), false, 'user/setMyProfile'),
    updateMyProfile: (myProfileInfo) =>
      set(
        (state) => ({
          myProfile: state.myProfile ? { ...state.myProfile, ...myProfileInfo } : undefined,
        }),
        false,
        'user/updateMyProfile',
      ),
    resetMyProfile: () => set(initialState),
    getFriendList: async () => {
      try {
        const friendList = await getFriendList();
        set(
          () => ({ friendList: { state: 'hasValue', data: friendList.results } }),
          false,
          'user/getFriendList',
        );
      } catch {
        set(() => ({ friendList: { state: 'hasError' } }));
      }
    },
    isUserAuthor: (authorId) => get().myProfile?.id === authorId,
    setFcmToken: (fcmToken) => set(() => ({ fcmToken }), false, 'user/setFcmToken'),
    setFeatureFlags: () => {
      const currVersion = get().myProfile?.current_ver;

      console.debug('currVersion', currVersion);
      if (!currVersion) return;

      const featureFlags =
        FEATURE_FLAG_MAP_COLLECTION[currVersion] ??
        FEATURE_FLAG_MAP_COLLECTION[VersionType.DEFAULT];
      set(() => ({ featureFlags }), false, 'user/setFeatureFlags');
    },
  };
};

export const UserSelector = (state: BoundState) => ({
  myProfile: state.myProfile,
  friendList: state.friendList,
  featureFlags: state.featureFlags,
  getFriendList: state.getFriendList,
});
