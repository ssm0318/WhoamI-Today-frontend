import { SignUpParams } from '@models/api/user';
import { SliceStateCreator } from './useBoundStore';

interface SignUpInfoState {
  signUpInfo: Partial<SignUpParams>;
}

interface SignupInfoAction {
  setSignUpInfo: (signUpInfo: Partial<SignUpParams>) => void;
  resetSignUpInfo: () => void;
}

const initialState = {
  signUpInfo: {
    email: undefined,
    username: undefined,
    password: undefined,
    profileImage: undefined,
  },
};

export type SignUpInfoSlice = SignUpInfoState & SignupInfoAction;

export const createSignUpInfoSlice: SliceStateCreator<SignUpInfoSlice> = (set) => ({
  ...initialState,
  setSignUpInfo: (signUpInfo: SignUpParams) =>
    set(
      (state) => ({ signUpInfo: { ...state.signUpInfo, ...signUpInfo } }),
      false,
      'signUpInfo/setSignUpInfo',
    ),
  resetSignUpInfo: () => set(initialState),
});
