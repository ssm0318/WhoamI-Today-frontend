import { SignInParams, SignInResponse } from '@models/api/user';
import axios from '@utils/apis/axios';

export const signIn = async (signInInfo: SignInParams, onSuccess: () => void) => {
  try {
    const {
      data: { access },
    } = await axios.post<SignInResponse>('/user/token/', signInInfo);

    // FIXME: 이후 가능하면 backend에서 쿠키를 세팅하는 방식으로 변경하려 합니다
    // https://github.com/GooJinSun/WhoAmI-Today-backend/issues/1#issuecomment-1537058512
    axios.defaults.headers.common.Authorization = `Bearer ${access}`;

    // FIXME: 유저정보 세팅
    axios.get('/user/me/');
    onSuccess();
  } catch (e) {
    // TODO: 에러 핸들링
    console.log(e);
  }
};

export default signIn;
