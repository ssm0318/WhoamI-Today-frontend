import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import ProfileImageEdit from '@components/_common/profile-image-edit/ProfileImageEdit';
import ProfileImageEditButton from '@components/_common/profile-image-edit-button/ProfileImageEditButton';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import ValidatedTextArea from '@components/_common/validated-textarea/ValidatedTextArea';
import EditPersonaBottomSheet from '@components/profile/edit-persona/EditPersonaBottomSheet';
import PersonaChip from '@components/profile/persona/PersonaChip';
import { StyledEditProfileButton } from '@components/settings/SettingsButtons.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { MyProfile } from '@models/api/user';
import { Persona } from '@models/persona';
import { useBoundStore } from '@stores/useBoundStore';
import { editProfile } from '@utils/apis/my';
import { generateRandomColor } from '@utils/colorHelpers';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import { MainScrollContainer } from '../Root';

function EditProfile() {
  const location = useLocation();
  const isFromSignUp = !!location.state?.fromSignUp;

  const [t] = useTranslation('translation', { keyPrefix: 'settings.edit_profile' });
  const { myProfile, updateMyProfile, openToast } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    updateMyProfile: state.updateMyProfile,
    openToast: state.openToast,
  }));

  // Create a persistent color mapping for each persona
  const personaColorMap = useMemo(() => {
    const colorMap: Record<string, string> = {};
    // Initialize with all possible personas
    Object.values(Persona).forEach((p) => {
      colorMap[p] = generateRandomColor();
    });
    return colorMap;
  }, []);

  const [draft, setDraft] = useState<Pick<MyProfile, 'bio' | 'username' | 'pronouns' | 'persona'>>({
    bio: myProfile?.bio ?? '',
    username: myProfile?.username ?? '',
    pronouns: myProfile?.pronouns ?? '',
    persona: myProfile?.persona ?? [],
  });

  const [usernameError, setUsernameError] = useState<string>();

  const inputRef = useRef<HTMLInputElement>(null);

  const [originalImageFileUrl, setOriginalImageFileURL] = useState<string>();
  const [croppedImg, setCroppedImg] = useState<CroppedImg>();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPersonaEditModalVisible, setIsPersonaEditModalVisible] = useState(false);

  const [imageChanged, setImageChanged] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const hasDraftChanged =
      draft.username !== (myProfile?.username ?? '') ||
      draft.pronouns !== (myProfile?.pronouns ?? '') ||
      draft.bio !== (myProfile?.bio ?? '') ||
      draft.persona !== (myProfile?.persona ?? []) ||
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

  const handlePersonaSelect = (personas: Persona[]) => {
    setDraft((prev) => ({ ...prev, persona: personas }));
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
        {/* persona */}
        <Typo type="title-medium" color="MEDIUM_GRAY">
          {t('persona')}
        </Typo>
        <Layout.FlexCol w="100%" outline="LIGHT_GRAY" rounded={12} style={{ overflow: 'hidden' }}>
          <Layout.FlexRow
            gap={8}
            pv={12}
            ph={12}
            style={{
              flexWrap: 'wrap',
            }}
            w="100%"
          >
            {draft.persona.length > 0 ? (
              draft.persona.map((persona) => (
                <div key={persona} style={{ margin: '4px 0' }}>
                  <PersonaChip persona={persona} color={personaColorMap[persona]} />
                </div>
              ))
            ) : (
              <Layout.FlexRow w="100%" alignItems="center" justifyContent="center" rounded={12}>
                <Icon
                  onClick={() => setIsPersonaEditModalVisible(true)}
                  name="add_default"
                  size={24}
                />
              </Layout.FlexRow>
            )}
          </Layout.FlexRow>
          {draft.persona.length > 0 && (
            <Layout.FlexRow
              w="100%"
              alignItems="center"
              justifyContent="center"
              bgColor="LIGHT_GRAY"
              pv={8}
              style={{ borderTop: '1px solid #EEEEEE' }}
              onClick={() => setIsPersonaEditModalVisible(true)}
            >
              <Icon name="edit_filled" size={20} />
              <Typo type="label-medium" ml={4} color="MEDIUM_GRAY">
                {t('persona_edit_bottom_sheet.edit')}
              </Typo>
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
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
      {isPersonaEditModalVisible && (
        <EditPersonaBottomSheet
          visible={isPersonaEditModalVisible}
          closeBottomSheet={() => setIsPersonaEditModalVisible(false)}
          onSelect={handlePersonaSelect}
          selectedPersonas={draft.persona}
          personaColorMap={personaColorMap}
        />
      )}
    </MainScrollContainer>
  );
}

export default EditProfile;
