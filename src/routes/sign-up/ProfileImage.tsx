import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProfileImageEdit from '@components/_common/profile-image-edit/ProfileImageEdit';
import UserProfile from '@components/_common/user-profile/UserProfile';
import { Button, Layout } from '@design-system';
import { hasMandatorySignUpParams } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import { signUp } from '@utils/apis/user';
import { CroppedImg, readFile } from '@utils/getCroppedImg';

function ProfileImage() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });

  const inputRef = useRef<HTMLInputElement>(null);

  const [originalImageFileUrl, setOriginalImageFileURL] = useState<string>();
  const [profileImagePreview, setProfileImagePreview] = useState<string>();
  const [signUpInfo, setSignUpInfo, resetSignUpInfo] = useBoundStore((state) => [
    state.signUpInfo,
    state.setSignUpInfo,
    state.resetSignUpInfo,
  ]);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const onClickAdd = () => {
    inputRef.current?.click();
  };

  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const image = e.target.files[0];

    try {
      const imageDataUrl = await readFile(image);

      if (typeof imageDataUrl !== 'string') {
        throw new Error('read file error');
      }

      setOriginalImageFileURL(imageDataUrl);
      setIsEditModalVisible(true);
    } catch (error) {
      // TODO
      console.error(error);
    }
  };

  const onCompleteImageCrop = (croppedImage: CroppedImg) => {
    setSignUpInfo({ profileImage: croppedImage.file });
    setProfileImagePreview(croppedImage.url);
  };

  const navigate = useNavigate();
  const onClickNextOrSkip = () => {
    if (!hasMandatorySignUpParams(signUpInfo)) return;

    signUp({
      signUpInfo,
      onSuccess: () => {
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
      {profileImagePreview && <UserProfile imageUrl={profileImagePreview} size={400} />}
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
      {isEditModalVisible && (
        <ProfileImageEdit
          setIsVisible={setIsEditModalVisible}
          image={originalImageFileUrl}
          onCompleteImageCrop={onCompleteImageCrop}
        />
      )}
    </>
  );
}

export default ProfileImage;
