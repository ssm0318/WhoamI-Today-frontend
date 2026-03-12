import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import ProfileImageEdit from '@components/_common/profile-image-edit/ProfileImageEdit';
import ProfileImageEditButton from '@components/_common/profile-image-edit-button/ProfileImageEditButton';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import ValidatedTextArea from '@components/_common/validated-textarea/ValidatedTextArea';
import InterestChip from '@components/profile/interest/InterestChip';
import PersonaChip from '@components/profile/persona/PersonaChip';
import { StyledEditProfileButton } from '@components/settings/SettingsButtons.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { MyProfile } from '@models/api/user';
import { Interest } from '@models/interest';
import { Persona } from '@models/persona';
import { useBoundStore } from '@stores/useBoundStore';
import { editProfile } from '@utils/apis/my';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import { MainScrollContainer } from '../Root';

const CHIP_LIST_LIMIT = 10;
const CHIP_LIST_COLLAPSED_COUNT = 10;

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

  const [draft, setDraft] = useState<{
    bio: string;
    username: string;
    pronouns: string;
    user_personas: string[];
    user_interests: string[];
  }>({
    bio: myProfile?.bio ?? '',
    username: myProfile?.username ?? '',
    pronouns: myProfile?.pronouns ?? '',
    user_personas: (myProfile?.user_personas ?? []).map((p) => p.replace(/^#+/, '')),
    user_interests: (myProfile?.user_interests ?? []).map((i) => i.replace(/^#+/, '')),
  });

  const [usernameError, setUsernameError] = useState<string>();
  const [isPersonaListExpanded, setIsPersonaListExpanded] = useState(false);
  const [isInterestListExpanded, setIsInterestListExpanded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [originalImageFileUrl, setOriginalImageFileURL] = useState<string>();
  const [croppedImg, setCroppedImg] = useState<CroppedImg>();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [imageChanged, setImageChanged] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const arraysEqual = (a: string[], b: string[]): boolean => {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((val, index) => val === sortedB[index]);
    };

    const originalPersonas = (myProfile?.user_personas ?? []).map((p) => p.replace(/^#+/, ''));
    const originalInterests = (myProfile?.user_interests ?? []).map((i) => i.replace(/^#+/, ''));

    const hasDraftChanged =
      draft.username !== (myProfile?.username ?? '') ||
      draft.pronouns !== (myProfile?.pronouns ?? '') ||
      draft.bio !== (myProfile?.bio ?? '') ||
      !arraysEqual(draft.user_personas, originalPersonas) ||
      !arraysEqual(draft.user_interests, originalInterests) ||
      imageChanged;

    setHasChanges(hasDraftChanged);
  }, [draft, imageChanged, myProfile]);

  const handleTogglePersona = (persona: string) => {
    setDraft((prev) => {
      const current = [...prev.user_personas];
      if (current.includes(persona)) {
        return { ...prev, user_personas: current.filter((p) => p !== persona) };
      }
      if (current.length < CHIP_LIST_LIMIT) {
        return { ...prev, user_personas: [...current, persona] };
      }
      return prev;
    });
  };

  const handleToggleInterest = (interest: string) => {
    setDraft((prev) => {
      const current = [...prev.user_interests];
      if (current.includes(interest)) {
        return { ...prev, user_interests: current.filter((i) => i !== interest) };
      }
      if (current.length < CHIP_LIST_LIMIT) {
        return { ...prev, user_interests: [...current, interest] };
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
        openToast({ message: t('error.read_file_error') || '' });
        return;
      }

      setOriginalImageFileURL(imageDataUrl);
      setIsEditModalVisible(true);
    } catch (error) {
      const errMsg = (error as Error)?.message;
      if (!errMsg) return;
      openToast({ message: errMsg });
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
        updateMyProfile({
          ...data,
          user_interests: data.user_interests ?? draft.user_interests,
          user_personas: data.user_personas ?? draft.user_personas,
          profile_image: data.profile_image ?? myProfile?.profile_image,
        });
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
        <Layout.FlexCol gap={8}>
          <Typo type="title-medium" color="MEDIUM_GRAY">
            {t('interests')}
          </Typo>
          <Layout.FlexCol w="100%" outline="LIGHT_GRAY" rounded={12} style={{ overflow: 'hidden' }}>
            <Layout.FlexCol w="100%" alignItems="center" ph={12} pv={16}>
              <Layout.FlexRow mt={8} mb={2}>
                <Typo
                  type="body-medium"
                  color={draft.user_interests.length >= CHIP_LIST_LIMIT ? 'WARNING' : 'DARK'}
                >
                  {draft.user_interests.length} / {CHIP_LIST_LIMIT}{' '}
                  {t('persona_edit_bottom_sheet.selected')}
                </Typo>
              </Layout.FlexRow>
              {draft.user_interests.length >= CHIP_LIST_LIMIT && (
                <Layout.FlexRow mb={4}>
                  <Typo type="body-small" color="WARNING">
                    {t('persona_edit_bottom_sheet.max_persona_limit')}
                  </Typo>
                </Layout.FlexRow>
              )}
              <Layout.FlexRow gap={6} pv={16} style={{ flexWrap: 'wrap' }} w="100%">
                {Object.values(Interest)
                  .slice(0, isInterestListExpanded ? undefined : CHIP_LIST_COLLAPSED_COUNT)
                  .map((interest) => (
                    <InterestChip
                      interest={interest}
                      key={interest}
                      onSelect={handleToggleInterest}
                      isSelected={draft.user_interests.includes(interest)}
                    />
                  ))}
              </Layout.FlexRow>
              {!isInterestListExpanded &&
                Object.values(Interest).length > CHIP_LIST_COLLAPSED_COUNT && (
                  <Layout.FlexRow
                    w="100%"
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => setIsInterestListExpanded(true)}
                    pv={8}
                    style={{ cursor: 'pointer' }}
                  >
                    <Icon name="chevron_down" size={16} />
                  </Layout.FlexRow>
                )}
              {isInterestListExpanded &&
                Object.values(Interest).length > CHIP_LIST_COLLAPSED_COUNT && (
                  <Layout.FlexRow
                    w="100%"
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => setIsInterestListExpanded(false)}
                    pv={8}
                    style={{ cursor: 'pointer' }}
                  >
                    <Icon name="chevron_up" size={16} />
                  </Layout.FlexRow>
                )}
            </Layout.FlexCol>
          </Layout.FlexCol>
        </Layout.FlexCol>

        {/* persona */}
        {featureFlags?.persona && (
          <Layout.FlexCol gap={8}>
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
                    color={draft.user_personas.length >= CHIP_LIST_LIMIT ? 'WARNING' : 'DARK'}
                  >
                    {draft.user_personas.length} / {CHIP_LIST_LIMIT}{' '}
                    {t('persona_edit_bottom_sheet.selected')}
                  </Typo>
                </Layout.FlexRow>
                {draft.user_personas.length >= CHIP_LIST_LIMIT && (
                  <Layout.FlexRow mb={4}>
                    <Typo type="body-small" color="WARNING">
                      {t('persona_edit_bottom_sheet.max_persona_limit')}
                    </Typo>
                  </Layout.FlexRow>
                )}
                <Layout.FlexRow gap={6} pv={16} style={{ flexWrap: 'wrap' }} w="100%">
                  {Object.values(Persona)
                    .slice(0, isPersonaListExpanded ? undefined : CHIP_LIST_COLLAPSED_COUNT)
                    .map((persona) => (
                      <PersonaChip
                        persona={persona}
                        key={persona}
                        onSelect={handleTogglePersona}
                        isSelected={draft.user_personas.includes(persona)}
                      />
                    ))}
                </Layout.FlexRow>
                {!isPersonaListExpanded &&
                  Object.values(Persona).length > CHIP_LIST_COLLAPSED_COUNT && (
                    <Layout.FlexRow
                      w="100%"
                      justifyContent="center"
                      alignItems="center"
                      onClick={() => setIsPersonaListExpanded(true)}
                      pv={8}
                      style={{ cursor: 'pointer' }}
                    >
                      <Icon name="chevron_down" size={16} />
                    </Layout.FlexRow>
                  )}
                {isPersonaListExpanded &&
                  Object.values(Persona).length > CHIP_LIST_COLLAPSED_COUNT && (
                    <Layout.FlexRow
                      w="100%"
                      justifyContent="center"
                      alignItems="center"
                      onClick={() => setIsPersonaListExpanded(false)}
                      pv={8}
                      style={{ cursor: 'pointer' }}
                    >
                      <Icon name="chevron_up" size={16} />
                    </Layout.FlexRow>
                  )}
              </Layout.FlexCol>
            </Layout.FlexCol>
          </Layout.FlexCol>
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
