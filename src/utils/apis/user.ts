import { redirect } from 'react-router-dom';
import { SignInParams, SignInResponse } from '@models/api/user';
import axios from '@utils/apis/axios';

export const signIn = (signInInfo: SignInParams, onSuccess: () => void) => {
  axios
    .post<SignInResponse>('/user/login/', signInInfo)
    .then(() => onSuccess())
    // TODO
    .catch((e) => console.log(e));
};

export const checkIfSignIn = async () => {
  try {
    const user = await axios.get('/user/me/');
    // TODO: zustand 상태 설정 등
    return user;
  } catch {
    return redirect('/signin');
  }
};
