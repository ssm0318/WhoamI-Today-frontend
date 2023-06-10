import { AxiosError } from 'axios';
import { redirect } from 'react-router-dom';
import i18n from '@i18n/index';
import {
  EmailError,
  PasswordError,
  SignInParams,
  SignInResponse,
  SignUpParams,
  UsernameError,
} from '@models/api/user';
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
    .catch((e: AxiosError<EmailError>) => {
      if (e.response?.data.detail) {
        onError(e.response.data.detail);
        return;
      }
      onError(i18n.t('sign_up.temporary_error'));
    });
};

export const validatePassword = ({
  password,
  onSuccess,
  onError,
}: {
  password: string;
  onSuccess: () => void;
  onError: (errorMsg: string) => void;
}) => {
  axiosFormDataInstance
    .post('/user/signup/password/', { password })
    .then(() => {
      onSuccess();
    })
    .catch((e: AxiosError<PasswordError>) => {
      if (e.response?.data.password[0]) {
        onError(e.response.data.password[0]);
        return;
      }
      onError(i18n.t('sign_up.temporary_error'));
    });
};

export const validateUsername = ({
  username,
  onSuccess,
  onError,
}: {
  username: string;
  onSuccess: () => void;
  onError: (errorMsg: string) => void;
}) => {
  axiosFormDataInstance
    .post('/user/signup/username/', { username })
    .then(() => {
      onSuccess();
    })
    .catch((e: AxiosError<UsernameError>) => {
      if (e.response?.data.detail) {
        onError(e.response.data.detail);
        return;
      }
      onError(i18n.t('sign_up.temporary_error'));
    });
};

export const signUp = ({
  signUpInfo,
  onSuccess,
  onError,
}: {
  signUpInfo: SignUpParams;
  onSuccess: () => void;
  onError: (error: string) => void;
}) => {
  const formData = new FormData();

  const {
    email,
    password,
    username,
    profileImage,
    research_agreement,
    age,
    gender,
    signature,
    date_of_signature,
  } = signUpInfo;

  if (profileImage) {
    formData.append('profile_image', profileImage);
  }
  formData.append('email', email);
  formData.append('username', username);
  formData.append('password', password);

  if (research_agreement) {
    formData.append('research_agreement', `${research_agreement}`);
    if (age) formData.append('age', `${age}`);
    if (gender) formData.append('gender', `${gender}`);
    if (signature) formData.append('signature', `${signature}`);
    if (date_of_signature) formData.append('date_of_signature', `${date_of_signature}`);
  }

  axiosFormDataInstance
    .post('/user/signup/', formData)
    .then(() => onSuccess())
    .catch((e) => {
      onError(e);
    });
};
