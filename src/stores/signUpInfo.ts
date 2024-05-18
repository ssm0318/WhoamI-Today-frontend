import { SignUpParams } from '@models/api/user';
import { sliceResetFns } from './resetSlices';
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

export const createSignUpInfoSlice: SliceStateCreator<SignUpInfoSlice> = (set) => {
  sliceResetFns.add(() => set(initialState));
  return {
    ...initialState,
    setSignUpInfo: (signUpInfo) =>
      set(
        (state) => ({ signUpInfo: { ...state.signUpInfo, ...signUpInfo } }),
        false,
        'signUpInfo/setSignUpInfo',
      ),
    resetSignUpInfo: () => set(initialState),
  };
};
