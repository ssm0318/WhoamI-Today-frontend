import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import ProfileImageEdit from '@components/_common/profile-image-edit/ProfileImageEdit';
import { Button, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

function AddProfileImage() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });

  const inputRef = useRef<HTMLInputElement>(null);

  const [originalImageFileUrl, setOriginalImageFileURL] = useState<string>();
  const [profileImagePreview, setProfileImagePreview] = useState<string>();
  const setSignUpInfo = useBoundStore((state) => state.setSignUpInfo);

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
    navigate('/signup/noti-settings');
  };

  return (
    <>
      <ProfileImage imageUrl={profileImagePreview} size={230} />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg, image/png"
        onChange={onImageChange}
        multiple={false}
        style={{ display: 'none' }}
      />
      <Layout.Fixed l={0} b="50px" w="100%" alignItems="center" gap={24} ph={24}>
        {!profileImagePreview && (
          <Button.Large
            type="gray_fill"
            status="normal"
            width={AUTH_BUTTON_WIDTH}
            text={t('add')}
            onClick={onClickAdd}
          />
        )}
        <Button.Large
          type="gray_fill"
          status="normal"
          width={AUTH_BUTTON_WIDTH}
          text={profileImagePreview ? t('next') : t('skip')}
          onClick={onClickNextOrSkip}
        />
      </Layout.Fixed>
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

export default AddProfileImage;
