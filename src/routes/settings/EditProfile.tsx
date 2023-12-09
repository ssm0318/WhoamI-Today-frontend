import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Divider } from '@components/_common/divider/Divider.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import ProfileImageEdit from '@components/_common/profile-image-edit/ProfileImageEdit';
import { StyledEditProfileButton } from '@components/settings/SettingsButtons.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Button, Font, Layout } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { changeProfileImage, updateMyProfile } from '@utils/apis/user';
import { CroppedImg, readFile } from '@utils/getCroppedImg';

function EditProfile() {
  const [t] = useTranslation('translation', { keyPrefix: 'settings' });

  const { myProfile } = useBoundStore(UserSelector);

  const inputRef = useRef<HTMLInputElement>(null);

  const [originalImageFileUrl, setOriginalImageFileURL] = useState<string>();
  const [croppedImg, setCroppedImg] = useState<CroppedImg>();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleClickUpdate = () => {
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

  const handleCompleteImageCrop = (img: CroppedImg) => {
    setCroppedImg(img);
  };

  const navigate = useNavigate();
  const handleChangeProfileImage = async () => {
    if (!croppedImg) return;
    await changeProfileImage({ profileImage: croppedImg.file });
    updateMyProfile().then(() => {
      navigate('/settings');
    });
  };

  if (!myProfile) return null;

  return (
    <MainContainer>
      <SubHeader typo="title-large" title={t('edit_profile')} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%" gap={10}>
        <Layout.FlexCol pt={12} pb={19} bgColor="GRAY_10" w="100%" alignItems="center">
          <StyledEditProfileButton type="button" onClick={handleClickUpdate}>
            <ProfileImage
              imageUrl={croppedImg?.url || myProfile.profile_image}
              username={myProfile.username}
              size={124}
            />
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg, image/png"
              onChange={onImageChange}
              multiple={false}
              style={{ display: 'none' }}
            />
            <Font.Display type="14_regular">{t('change_picture')}</Font.Display>
          </StyledEditProfileButton>
        </Layout.FlexCol>
      </Layout.FlexCol>
      <Layout.FlexCol pt={32} ph={24} gap={24} w="100%">
        <Font.Display type="14_regular">{t('username')}</Font.Display>
        <Font.Body type="18_regular">{myProfile.username}</Font.Body>
        <Divider width={1} />
        <Font.Display type="14_regular">{t('email')}</Font.Display>
        <Font.Body type="18_regular">{myProfile.email}</Font.Body>
      </Layout.FlexCol>
      {croppedImg && (
        <Layout.Absolute w="100%" b="50px" pl={24} pr={24} flexDirection="column">
          <Button.Large
            type="filled"
            status="normal"
            sizing="stretch"
            text={t('update')}
            onClick={handleChangeProfileImage}
          />
        </Layout.Absolute>
      )}
      {isEditModalVisible && (
        <ProfileImageEdit
          setIsVisible={setIsEditModalVisible}
          image={originalImageFileUrl}
          onCompleteImageCrop={handleCompleteImageCrop}
        />
      )}
    </MainContainer>
  );
}

export default EditProfile;
