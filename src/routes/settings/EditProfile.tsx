import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Divider } from '@components/_common/divider/Divider.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import ProfileImageEdit from '@components/_common/profile-image-edit/ProfileImageEdit';
import UserProfile from '@components/_common/user-profile/UserProfile';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Font, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { changeProfileImage } from '@utils/apis/user';
import { CroppedImg, readFile } from '@utils/getCroppedImg';

function EditProfile() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings' });
  const myProfile = useBoundStore((state) => state.myProfile);

  const navigate = useNavigate();
  const handleClickUpdate = () => {
    if (!profileImagePreview) return;
    changeProfileImage(profileImagePreview.file, () => navigate('/settings'));
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const [originalImageFileUrl, setOriginalImageFileURL] = useState<string>();
  const [profileImagePreview, setProfileImagePreview] = useState<CroppedImg>();

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
    setProfileImagePreview(croppedImage);
  };

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // TODO: 프로필 없을 때 처리
  if (!myProfile) return null;

  const { username, email, profile_image } = myProfile;
  return (
    <MainContainer>
      <TitleHeader title={t('edit_profile')} type="SUB" />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%" gap={10}>
        <Layout.FlexCol
          pt={12}
          pb={19}
          bgColor="GRAY_10"
          w="100%"
          alignItems="center"
          onClick={onClickAdd}
        >
          <UserProfile
            imageUrl={profileImagePreview?.url ?? profile_image}
            username={username}
            size={124}
          />
          <Font.Display type="14_regular">{t('change_picture')}</Font.Display>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg, image/png"
            onChange={onImageChange}
            multiple={false}
            style={{ display: 'none' }}
          />
        </Layout.FlexCol>
      </Layout.FlexCol>
      <Layout.FlexCol pt={32} pl={24} pr={24} gap={24} w="100%">
        <Font.Display type="14_regular">{t('username')}</Font.Display>
        <Font.Body type="18_regular">{username}</Font.Body>
        <Divider width={1} />
        <Font.Display type="14_regular">{t('email')}</Font.Display>
        <Font.Body type="18_regular">{email}</Font.Body>
      </Layout.FlexCol>
      <Layout.Absolute w="100%" b="50px" pl={24} pr={24} flexDirection="column">
        <Button.Large
          type="filled"
          status={profileImagePreview ? 'normal' : 'disabled'}
          sizing="stretch"
          text={t('update')}
          onClick={handleClickUpdate}
        />
      </Layout.Absolute>
      {isEditModalVisible && (
        <ProfileImageEdit
          setIsVisible={setIsEditModalVisible}
          image={originalImageFileUrl}
          onCompleteImageCrop={onCompleteImageCrop}
        />
      )}
    </MainContainer>
  );
}

export default EditProfile;
