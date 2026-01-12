import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import HashtagSelectInput from '@components/_common/hashtag-select-input/HashtagSelectInput';
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
import { editProfile, searchInterests, searchPersonas } from '@utils/apis/my';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import { MainScrollContainer } from '../Root';

function EditProfile() {
  const location = useLocation();
  const isFromSignUp = !!location.state?.fromSignUp;
  const [searchParams] = useSearchParams();
  const isFromResetPassword = searchParams.get('from_reset_password') === 'true';
  const [t] = useTranslation('translation', { keyPrefix: 'settings.edit_profile' });
  const { myProfile, updateMyProfile, openToast, featureFlags } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    updateMyProfile: state.updateMyProfile,
    openToast: state.openToast,
    featureFlags: state.featureFlags,
  }));

  const [draft, setDraft] = useState<
    Pick<MyProfile, 'bio' | 'username' | 'pronouns' | 'user_personas' | 'user_interests'>
  >({
    bio: myProfile?.bio ?? '',
    username: myProfile?.username ?? '',
    pronouns: myProfile?.pronouns ?? '',
    user_personas: myProfile?.user_personas ?? [],
    user_interests: myProfile?.user_interests ?? [],
  });

  const [usernameError, setUsernameError] = useState<string>();

  // Interest 관련 상태
  const [interestOptions, setInterestOptions] = useState<string[]>([]);
  const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);
  const [selectedInterestOptions, setSelectedInterestOptions] = useState<string[]>([]);
  const [isLoadingInterests, setIsLoadingInterests] = useState(false);

  // Persona 관련 상태
  const [personaOptions, setPersonaOptions] = useState<string[]>([]);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const [selectedPersonaOptions, setSelectedPersonaOptions] = useState<string[]>([]);
  const [isLoadingPersonas, setIsLoadingPersonas] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [originalImageFileUrl, setOriginalImageFileURL] = useState<string>();
  const [croppedImg, setCroppedImg] = useState<CroppedImg>();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [imageChanged, setImageChanged] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // 초기 선택된 Interest와 Persona 설정
  useEffect(() => {
    if (myProfile) {
      // 배열에서 "#" 접두사를 제거하여 소문자로 변환
      const interests =
        Array.isArray(myProfile.user_interests) && myProfile.user_interests.length > 0
          ? myProfile.user_interests.map((item) => item.replace(/^#+/, '').toLowerCase())
          : [];
      const personas =
        Array.isArray(myProfile.user_personas) && myProfile.user_personas.length > 0
          ? myProfile.user_personas.map((item) => item.replace(/^#+/, '').toLowerCase())
          : [];

      setSelectedInterestIds(interests);
      setSelectedPersonaIds(personas);
      // 초기 선택된 항목들을 설정
      setSelectedInterestOptions(interests);
      setSelectedPersonaOptions(personas);
    }
  }, [myProfile]);

  // Interest 검색
  const handleSearchInterests = useCallback(async (query: string) => {
    setIsLoadingInterests(true);
    try {
      const results = await searchInterests(query);
      setInterestOptions(results);
    } catch (error) {
      console.error('Failed to search interests:', error);
      setInterestOptions([]);
    } finally {
      setIsLoadingInterests(false);
    }
  }, []);

  // Persona 검색
  const handleSearchPersonas = useCallback(async (query: string) => {
    setIsLoadingPersonas(true);
    try {
      const results = await searchPersonas(query);
      setPersonaOptions(results);
    } catch (error) {
      console.error('Failed to search personas:', error);
      setPersonaOptions([]);
    } finally {
      setIsLoadingPersonas(false);
    }
  }, []);

  // Interest 선택 변경
  const handleInterestChange = useCallback((labels: string[]) => {
    setSelectedInterestIds(labels);
    setSelectedInterestOptions(labels);

    // 저장할 때는 label에 "#" 접두사를 붙여서 배열로 저장
    const hashtags = labels.map((label) => {
      const cleanLabel = label.startsWith('#') ? label : `#${label}`;
      return cleanLabel;
    });
    setDraft((prev) => ({
      ...prev,
      user_interests: hashtags,
    }));
  }, []);

  // Persona 선택 변경
  const handlePersonaChange = useCallback((labels: string[]) => {
    setSelectedPersonaIds(labels);
    setSelectedPersonaOptions(labels);

    // 저장할 때는 label에 "#" 접두사를 붙여서 배열로 저장
    const hashtags = labels.map((label) => {
      const cleanLabel = label.startsWith('#') ? label : `#${label}`;
      return cleanLabel;
    });
    setDraft((prev) => ({
      ...prev,
      user_personas: hashtags,
    }));
  }, []);

  useEffect(() => {
    // 배열 비교를 위한 헬퍼 함수
    const arraysEqual = (a: string[], b: string[]): boolean => {
      if (a.length !== b.length) return false;
      return a.every((val, index) => val === b[index]);
    };

    const hasDraftChanged =
      draft.username !== (myProfile?.username ?? '') ||
      draft.pronouns !== (myProfile?.pronouns ?? '') ||
      draft.bio !== (myProfile?.bio ?? '') ||
      !arraysEqual(draft.user_personas ?? [], myProfile?.user_personas ?? []) ||
      !arraysEqual(draft.user_interests ?? [], myProfile?.user_interests ?? []) ||
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
        openToast({ message: t('error.read_file_error') || '' });
        return;
      }

      setOriginalImageFileURL(imageDataUrl);
      setIsEditModalVisible(true);
    } catch (error) {
      const errMsg = (error as Error)?.message;
      if (!errMsg) return;
      openToast({ message: errMsg });
      // Reset the file input to allow new file selection
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleCompleteImageCrop = (img: CroppedImg) => {
    setCroppedImg(img);
  };

  const navigate = useNavigate();

  const handleClickCancel = () => {
    if (isFromResetPassword) {
      navigate('/my');
    } else if (isFromSignUp) {
      navigate(featureFlags?.friendFeed ? '/friends/feed' : '/friends');
    } else {
      navigate(-1);
    }
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
    <MainScrollContainer>
      <SubHeader
        typo="title-large"
        title={t('title')}
        LeftComponent={
          <button type="button" onClick={handleClickCancel}>
            <Typo type="title-large" color="DARK">
              {isFromSignUp || isFromResetPassword ? t('cancel') : t('back')}
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

        {/* interests */}
        <HashtagSelectInput
          label={t('interests')}
          value={selectedInterestIds}
          options={interestOptions}
          selectedOptions={selectedInterestOptions}
          isLoading={isLoadingInterests}
          onChange={handleInterestChange}
          onSearch={handleSearchInterests}
          placeholder={t('interests_placeholder') || 'Add interests...'}
        />

        {/* persona */}
        <HashtagSelectInput
          label={t('persona')}
          value={selectedPersonaIds}
          options={personaOptions}
          selectedOptions={selectedPersonaOptions}
          isLoading={isLoadingPersonas}
          onChange={handlePersonaChange}
          onSearch={handleSearchPersonas}
          placeholder={t('persona_placeholder') || 'Add personas...'}
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
      </Layout.FlexCol>
      {isEditModalVisible && (
        <ProfileImageEdit
          setIsVisible={setIsEditModalVisible}
          image={originalImageFileUrl}
          onCompleteImageCrop={handleCompleteImageCrop}
          setImageChanged={setImageChanged}
        />
      )}
    </MainScrollContainer>
  );
}

export default EditProfile;
