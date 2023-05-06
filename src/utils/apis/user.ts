import { SignInParams, SignInResponse } from '@models/api/user';
import axios from '@utils/apis/axios';

export const signIn = async (signInInfo: SignInParams, onSuccess: () => void) => {
  try {
    const {
      data: { access },
    } = await axios.post<SignInResponse>('/user/token/', signInInfo);

    axios.defaults.headers.common.Authorization = `Bearer ${access}`;

    // FIXME: 유저정보 세팅
    axios.get('/user/me/');
    onSuccess();
  } catch (e) {
    console.log(e);
  }
};

export default signIn;
