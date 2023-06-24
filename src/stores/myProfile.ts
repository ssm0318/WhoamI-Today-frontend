import { MyProfile } from '@models/api/user';
import { SliceStateCreator } from './useBoundStore';

interface MyProfileState {
  myProfile: MyProfile | undefined;
}

interface MyProfileAction {
  setMyProfile: (myProfile: MyProfile) => void;
  resetMyProfile: () => void;
}

export type MyProfileSlice = MyProfileState & MyProfileAction;

const initialState = {
  myProfile: undefined,
};

export const createMyProfileSlice: SliceStateCreator<MyProfileSlice> = (set) => ({
  ...initialState,
  setMyProfile: (myProfile) => set(() => ({ myProfile }), false, 'myProfile/setMyProfile'),
  resetMyProfile: () => set(initialState),
});
