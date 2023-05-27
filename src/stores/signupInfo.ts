import { SignupParams } from '@models/api/user';
import { SliceStateCreator } from './useBoundStore';

interface SignupInfoState {
  signupInfo: Partial<SignupParams>;
}

interface SignupInfoAction {
  setSignupInfo: (signupInfo: Partial<SignupParams>) => void;
  resetSignupInfo: () => void;
}

const initialState = {
  signupInfo: {
    email: undefined,
    username: undefined,
    password: undefined,
    profileImage: undefined,
  },
};

export type SignupInfoSlice = SignupInfoState & SignupInfoAction;

export const createSignupInfoSlice: SliceStateCreator<SignupInfoSlice> = (set) => ({
  ...initialState,
  setSignupInfo: (signupInfo: SignupParams) =>
    set(
      (state) => ({ signupInfo: { ...state.signupInfo, ...signupInfo } }),
      false,
      'signupInfo/setSignupInfo',
    ),
  resetSignupInfo: () => set(initialState),
});
