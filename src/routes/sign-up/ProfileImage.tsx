import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { signUp } from '@utils/apis/user';

function ProfileImage() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });

  const inputRef = useRef<HTMLInputElement>(null);

  const [profileImagePreview, setProfileImagePreview] = useState<string>();
  const [signUpInfo, setSignUpInfo, resetSignUpInfo] = useBoundStore((state) => [
    state.signUpInfo,
    state.setSignUpInfo,
    state.resetSignUpInfo,
  ]);

  const onClickAdd = () => {
    inputRef.current?.click();
  };

  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const image = e.target.files[0];

    // TODO: 이미지 크롭, 압축
    setSignUpInfo({ profileImage: image });

    const objectUrl = URL.createObjectURL(image);
    setProfileImagePreview(objectUrl);
  };

  const navigate = useNavigate();
  const onClickNextOrSkip = () => {
    signUp({
      signUpInfo,
      onSuccess: () => {
        // TODO: access_token 쿠키 세팅 확인
        resetSignUpInfo();
        navigate('/home');
      },
      onError: (e) => {
        // TODO
        console.log(e);
      },
    });
  };

  return (
    <>
      {profileImagePreview && (
        <img src={profileImagePreview} width={400} height={400} alt="profile" />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg, image/png"
        onChange={onImageChange}
        multiple={false}
        style={{ display: 'none' }}
      />
      <Layout.Absolute w="100%" b="50px" flexDirection="column">
        {!profileImagePreview && (
          <Button.Large
            type="filled"
            status="normal"
            sizing="stretch"
            text={t('add')}
            onClick={onClickAdd}
          />
        )}
        <Button.Large
          type="filled"
          status="normal"
          sizing="stretch"
          text={profileImagePreview ? t('next') : t('skip')}
          onClick={onClickNextOrSkip}
        />
      </Layout.Absolute>
    </>
  );
}

export default ProfileImage;
