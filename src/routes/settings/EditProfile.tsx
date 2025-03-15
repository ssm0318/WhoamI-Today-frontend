import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import ProfileImageEdit from '@components/_common/profile-image-edit/ProfileImageEdit';
import ProfileImageEditButton from '@components/_common/profile-image-edit-button/ProfileImageEditButton';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import ValidatedTextArea from '@components/_common/validated-textarea/ValidatedTextArea';
import { StyledEditProfileButton } from '@components/settings/SettingsButtons.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { MyProfile } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import { editProfile } from '@utils/apis/my';
import { CroppedImg, readFile } from '@utils/getCroppedImg';

function EditProfile() {
  const location = useLocation();
  const isFromSignUp = !!location.state?.fromSignUp;

  const [t] = useTranslation('translation', { keyPrefix: 'settings.edit_profile' });
  const { myProfile, updateMyProfile, openToast } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    updateMyProfile: state.updateMyProfile,
    openToast: state.openToast,
  }));

  const [draft, setDraft] = useState<Pick<MyProfile, 'bio' | 'username' | 'pronouns'>>({
    bio: myProfile?.bio ?? '',
    username: myProfile?.username ?? '',
    pronouns: myProfile?.pronouns ?? '',
  });

  const [usernameError, setUsernameError] = useState<string>();

  const inputRef = useRef<HTMLInputElement>(null);

  const [originalImageFileUrl, setOriginalImageFileURL] = useState<string>();
  const [croppedImg, setCroppedImg] = useState<CroppedImg>();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [imageChanged, setImageChanged] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const hasDraftChanged =
      draft.username !== (myProfile?.username ?? '') ||
      draft.pronouns !== (myProfile?.pronouns ?? '') ||
      draft.bio !== (myProfile?.bio ?? '') ||
      imageChanged;

    setHasChanges(hasDraftChanged);
  }, [draft, imageChanged, myProfile]);

  const handleClickUpdate = () => {
    inputRef.current?.click();
  };

  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const image = e.target.files[0];

    try {
      const imageDataUrl = await readFile(image);

      if (typeof imageDataUrl !== 'string') {
        throw new Error(t('error.read_file_error') || '');
      }

      setOriginalImageFileURL(imageDataUrl);
      setIsEditModalVisible(true);
    } catch (error) {
      const errMsg = (error as Error)?.message;
      if (!errMsg) return;
      openToast({ message: errMsg });
    }
  };

  const handleCompleteImageCrop = (img: CroppedImg) => {
    setCroppedImg(img);
  };

  const navigate = useNavigate();

  const handleClickCancel = () => {
    return isFromSignUp ? navigate('/friends') : navigate(-1);
  };

  const handleClickSave = async () => {
    if (!myProfile) return;

    const profileData = {
      ...draft,
      ...(croppedImg ? { profile_image: croppedImg.file } : {}),
    };

    editProfile({
      profile: profileData,
      onSuccess: (data: MyProfile) => {
        updateMyProfile({ ...data });
        openToast({ message: t('response.updated') });
        navigate('/my');
      },
      onError: (error) => {
        if (error?.username) {
          return setUsernameError(t('username_valiation_error') || '');
        }

        if (error.detail) openToast({ message: error.detail });
      },
    });
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
    if (usernameError) {
      setUsernameError('');
    }
  };

  const handleChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  if (!myProfile) return null;

  return (
    <MainContainer>
      <SubHeader
        typo="title-large"
        title={t('title')}
        LeftComponent={
          <button type="button" onClick={handleClickCancel}>
            <Typo type="title-large" color="DARK">
              {isFromSignUp ? t('cancel') : t('back')}
            </Typo>
          </button>
        }
        RightComponent={
          <button type="button" onClick={handleClickSave} disabled={!hasChanges}>
            <Typo type="title-large" color={hasChanges ? 'PRIMARY' : 'LIGHT_GRAY'}>
              {t('done')}
            </Typo>
          </button>
        }
      />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%" gap={10}>
        <Layout.FlexCol pt={24} w="100%" alignItems="center">
          <StyledEditProfileButton type="button" onClick={handleClickUpdate}>
            <ProfileImage
              imageUrl={croppedImg?.url || myProfile.profile_image}
              username={myProfile.username}
              size={160}
            />
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg, image/png"
              onChange={onImageChange}
              multiple={false}
              style={{ display: 'none' }}
            />
            <ProfileImageEditButton size={40} iconSize={32} />
          </StyledEditProfileButton>
        </Layout.FlexCol>
      </Layout.FlexCol>
      <Layout.FlexCol pt={32} ph={24} gap={24} w="100%">
        {/* username */}
        <ValidatedInput
          label={t('username')}
          name="username"
          type="text"
          value={draft.username}
          onChange={handleChangeInput}
          limit={20}
          error={usernameError}
        />
        {/* pronouns */}
        <ValidatedInput
          label={t('pronouns')}
          name="pronouns"
          type="text"
          value={draft.pronouns}
          onChange={handleChangeInput}
        />
        {/* bio */}
        <ValidatedTextArea
          label={t('bio')}
          name="bio"
          value={draft.bio}
          onChange={handleChangeTextArea}
          limit={120}
        />
        {/* persona */}
      </Layout.FlexCol>
      {isEditModalVisible && (
        <ProfileImageEdit
          setIsVisible={setIsEditModalVisible}
          image={originalImageFileUrl}
          onCompleteImageCrop={handleCompleteImageCrop}
          setImageChanged={setImageChanged}
        />
      )}
    </MainContainer>
  );
}

export default EditProfile;
