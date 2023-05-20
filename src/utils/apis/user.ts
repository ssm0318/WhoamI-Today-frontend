import { AxiosError } from 'axios';
import { redirect } from 'react-router-dom';
import i18n from '@i18n/index';
import { SignInParams, SignInResponse, SignUpError } from '@models/api/user';
import axios, { axiosFormDataInstance } from '@utils/apis/axios';

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

export const signOut = () => {
  axios.get('/user/logout/');
};

export const validateEmail = ({
  email,
  onSuccess,
  onError,
}: {
  email: string;
  onSuccess: () => void;
  onError: (errorMsg: string) => void;
}) => {
  axiosFormDataInstance
    .post('/user/signup/email/', { email })
    .then(() => {
      onSuccess();
    })
    .catch((e: AxiosError<SignUpError>) => {
      if (e.response?.data.detail) {
        onError(e.response.data.detail);
        return;
      }
      onError(i18n.t('sign_up.temporary_error'));
    });
};
