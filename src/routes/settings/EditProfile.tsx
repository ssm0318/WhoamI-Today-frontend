import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import ProfileImageEdit from '@components/_common/profile-image-edit/ProfileImageEdit';
import ProfileImageEditButton from '@components/_common/profile-image-edit-button/ProfileImageEditButton';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import ValidatedTextArea from '@components/_common/validated-textarea/ValidatedTextArea';
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

const PERSONA_LIST_LIMIT = 10;
const PERSONA_LIST_EXPANDED_LIMIT = 10;

function EditProfile() {
  const location = useLocation();
  const isFromSignUp = !!location.state?.fromSignUp;

  const [t] = useTranslation('translation', { keyPrefix: 'settings.edit_profile' });
  const { myProfile, updateMyProfile, openToast, featureFlags } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    updateMyProfile: state.updateMyProfile,
    openToast: state.openToast,
    featureFlags: state.featureFlags,
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
  const [isPersonaListExpanded, setIsPersonaListExpanded] = useState(false);

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
      draft.persona !== (myProfile?.persona ?? []) ||
      imageChanged;

    setHasChanges(hasDraftChanged);
  }, [draft, imageChanged, myProfile]);

  const handleTogglePersona = (persona: Persona) => {
    setDraft((prev) => {
      const currentPersonas = [...prev.persona];

      if (currentPersonas.includes(persona)) {
        return {
          ...prev,
          persona: currentPersonas.filter((p) => p !== persona),
        };
      }

      if (currentPersonas.length < 10) {
        return {
          ...prev,
          persona: [...currentPersonas, persona],
        };
      }

      return prev;
    });
  };

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
        {featureFlags?.persona && (
          <>
            <Layout.FlexRow alignItems="center" gap={8}>
              <img width="14px" src="/whoami-logo.svg" alt="who_am_i" />
              <Typo type="title-medium" color="MEDIUM_GRAY">
                {t('persona')}
              </Typo>
            </Layout.FlexRow>

            <Layout.FlexCol
              w="100%"
              outline="LIGHT_GRAY"
              rounded={12}
              style={{ overflow: 'hidden' }}
            >
              <Layout.FlexCol w="100%" alignItems="center" ph={12} pv={16}>
                <Layout.FlexRow mt={8} mb={2}>
                  <Typo
                    type="body-medium"
                    color={draft.persona.length >= PERSONA_LIST_LIMIT ? 'WARNING' : 'DARK'}
                  >
                    {draft.persona.length} / {PERSONA_LIST_LIMIT}{' '}
                    {t('persona_edit_bottom_sheet.selected')}
                  </Typo>
                </Layout.FlexRow>
                {draft.persona.length >= PERSONA_LIST_LIMIT && (
                  <Layout.FlexRow mb={4}>
                    <Typo type="body-small" color="WARNING">
                      {t('persona_edit_bottom_sheet.max_persona_limit')}
                    </Typo>
                  </Layout.FlexRow>
                )}
                <Layout.FlexRow
                  gap={6}
                  pv={16}
                  style={{
                    flexWrap: 'wrap',
                  }}
                  w="100%"
                >
                  {Object.values(Persona)
                    .slice(0, isPersonaListExpanded ? undefined : PERSONA_LIST_EXPANDED_LIMIT)
                    .map((persona) => (
                      <PersonaChip
                        persona={persona}
                        key={persona}
                        onSelect={handleTogglePersona}
                        isSelected={draft.persona.includes(persona)}
                        color={personaColorMap[persona]}
                      />
                    ))}
                </Layout.FlexRow>
                {!isPersonaListExpanded &&
                  Object.values(Persona).length > PERSONA_LIST_EXPANDED_LIMIT && (
                    <Layout.FlexRow
                      w="100%"
                      justifyContent="center"
                      alignItems="center"
                      onClick={() => setIsPersonaListExpanded(true)}
                      pv={8}
                      style={{ cursor: 'pointer' }}
                    >
                      <Layout.FlexRow ml={4}>
                        <Icon name="chevron_down" size={16} />
                      </Layout.FlexRow>
                    </Layout.FlexRow>
                  )}
                {isPersonaListExpanded &&
                  Object.values(Persona).length > PERSONA_LIST_EXPANDED_LIMIT && (
                    <Layout.FlexRow
                      w="100%"
                      justifyContent="center"
                      alignItems="center"
                      onClick={() => setIsPersonaListExpanded(false)}
                      pv={8}
                      style={{ cursor: 'pointer' }}
                    >
                      <Layout.FlexRow ml={4}>
                        <Icon name="chevron_up" size={16} />
                      </Layout.FlexRow>
                    </Layout.FlexRow>
                  )}
              </Layout.FlexCol>
            </Layout.FlexCol>
          </>
        )}

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
