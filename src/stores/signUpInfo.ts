import { SignUpParams, UserGroup, VersionType } from '@models/api/user';
import { sliceResetFns } from './resetSlices';
import { SliceStateCreator } from './useBoundStore';

interface SignUpInfoState {
  signUpInfo: SignUpParams;
}

interface SignupInfoAction {
  setSignUpInfo: (signUpInfo: Partial<SignUpParams>) => void;
  resetSignUpInfo: () => void;
}

const initialState = {
  signUpInfo: {
    email: '',
    username: '',
    password: '',
    noti_time: '16:00',
    current_ver: VersionType.VER_Q,
    user_group: UserGroup.GROUP_Q_FIRST,
    inviter_id: 0,
    inviter_username: '',
    inviter_code: '',
    date_of_birth: '',
    research_agreement: false,
    signature: '',
    date_of_signature: '',
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
