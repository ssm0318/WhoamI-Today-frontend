import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import ProfileImageEdit from '@components/_common/profile-image-edit/ProfileImageEdit';
import ProfileImageEditButton from '@components/_common/profile-image-edit-button/ProfileImageEditButton';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import ValidatedTextArea from '@components/_common/validated-textarea/ValidatedTextArea';
import ChipCategorySection from '@components/profile/chip/ChipCategorySection';
import { StyledEditProfileButton } from '@components/settings/SettingsButtons.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { CheckBox, Layout, Typo } from '@design-system';
import { MyProfile } from '@models/api/user';
import { ALL_CATEGORIES, ChipCategory, CustomChip, normalizeChipText } from '@models/chips';
import { useBoundStore } from '@stores/useBoundStore';
import { createCustomChip, deleteCustomChip } from '@utils/apis/chips';
import { editProfile, updateChipsByCategory } from '@utils/apis/my';
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

  // Parse existing user chips into per-category selections
  const parseExistingChips = () => {
    const existing = [
      ...(myProfile?.user_interests ?? []).map((i) => i.replace(/^#+/, '')),
      ...(myProfile?.user_personas ?? []).map((p) => p.replace(/^#+/, '')),
    ];
    const result: Record<string, string[]> = {};
    const customResult: CustomChip[] = [];

    ALL_CATEGORIES.forEach((cat) => {
      const matched = existing.filter((chip) =>
        cat.chips.some((c) => normalizeChipText(c) === normalizeChipText(chip)),
      );
      result[cat.key] = matched.map(
        (m) => cat.chips.find((c) => normalizeChipText(c) === normalizeChipText(m)) || m,
      );
    });
    return { selections: result, customs: customResult };
  };

  const parsed = parseExistingChips();

  const [draft, setDraft] = useState<{
    bio: string;
    username: string;
    name: string;
    pronouns: string;
    chipSelections: Record<string, string[]>;
    customChips: CustomChip[];
    name_friends_only: boolean;
    interests_friends_only: boolean;
    persona_friends_only: boolean;
    pronouns_friends_only: boolean;
    bio_friends_only: boolean;
  }>({
    bio: myProfile?.bio ?? '',
    username: myProfile?.username ?? '',
    name: (myProfile as any)?.name ?? '',
    pronouns: myProfile?.pronouns ?? '',
    chipSelections: parsed.selections,
    customChips: parsed.customs,
    name_friends_only: (myProfile as any)?.name_friends_only ?? true,
    interests_friends_only: myProfile?.interests_friends_only ?? false,
    persona_friends_only: myProfile?.persona_friends_only ?? false,
    pronouns_friends_only: myProfile?.pronouns_friends_only ?? false,
    bio_friends_only: myProfile?.bio_friends_only ?? false,
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
      JSON.stringify(draft.chipSelections) !== JSON.stringify(parsed.selections) ||
      draft.customChips.length !== parsed.customs.length ||
      draft.interests_friends_only !== (myProfile?.interests_friends_only ?? false) ||
      draft.persona_friends_only !== (myProfile?.persona_friends_only ?? false) ||
      draft.pronouns_friends_only !== (myProfile?.pronouns_friends_only ?? false) ||
      draft.bio_friends_only !== (myProfile?.bio_friends_only ?? false) ||
      imageChanged;

    setHasChanges(hasDraftChanged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, imageChanged, myProfile]);

  const handleToggleChip = (category: ChipCategory, chipLabel: string) => {
    setDraft((prev) => {
      const current = [...(prev.chipSelections[category] || [])];
      if (current.some((c) => normalizeChipText(c) === normalizeChipText(chipLabel))) {
        return {
          ...prev,
          chipSelections: {
            ...prev.chipSelections,
            [category]: current.filter(
              (c) => normalizeChipText(c) !== normalizeChipText(chipLabel),
            ),
          },
        };
      }
      return {
        ...prev,
        chipSelections: {
          ...prev.chipSelections,
          [category]: [...current, chipLabel],
        },
      };
    });
  };

  const handleAddCustomChip = async (category: ChipCategory, text: string) => {
    try {
      const chip = await createCustomChip(text, category);
      setDraft((prev) => ({
        ...prev,
        customChips: [...prev.customChips, { id: chip.id, text: chip.text, category }],
      }));
    } catch {
      openToast({ message: 'Failed to add custom chip' });
    }
  };

  const handleRemoveCustomChip = async (category: ChipCategory, text: string) => {
    const chip = draft.customChips.find(
      (c) => c.category === category && normalizeChipText(c.text) === normalizeChipText(text),
    );
    if (chip?.id) {
      try {
        await deleteCustomChip(chip.id);
      } catch {
        // continue with local removal
      }
    }
    setDraft((prev) => ({
      ...prev,
      customChips: prev.customChips.filter(
        (c) => !(c.category === category && normalizeChipText(c.text) === normalizeChipText(text)),
      ),
    }));
  };

  const handleToggleVisibility = (field: string) => {
    setDraft((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
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

    // Save chips by category via dedicated endpoint
    try {
      await updateChipsByCategory(draft.chipSelections);
    } catch {
      // Chip save failed, continue with profile save
    }

    const profileData = {
      bio: draft.bio,
      username: draft.username,
      name: draft.name,
      pronouns: draft.pronouns,
      name_friends_only: draft.name_friends_only,
      interests_friends_only: draft.interests_friends_only,
      persona_friends_only: draft.persona_friends_only,
      pronouns_friends_only: draft.pronouns_friends_only,
      bio_friends_only: draft.bio_friends_only,
      ...(croppedImg ? { profile_image: croppedImg.file } : {}),
    };

    editProfile({
      profile: profileData,
      onSuccess: (data: MyProfile) => {
        updateMyProfile({
          ...data,
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
      <Layout.FlexCol pt={32} ph={24} pb={40} gap={16} w="100%">
        {/* username (always public) */}
        <ValidatedInput
          label={t('username')}
          name="username"
          type="text"
          value={draft.username}
          onChange={handleChangeInput}
          limit={20}
          error={usernameError}
        />

        {/* name (friends only option) */}
        <Layout.FlexCol gap={4} w="100%">
          <ValidatedInput
            label="Name"
            name="name"
            type="text"
            value={draft.name}
            onChange={handleChangeInput}
            limit={50}
          />
          <CheckBox
            name="Show name only to friends"
            checked={draft.name_friends_only}
            onChange={() => handleToggleVisibility('name_friends_only')}
          />
        </Layout.FlexCol>

        {/* pronouns */}
        <Layout.FlexCol gap={4} w="100%">
          <ValidatedInput
            label={t('pronouns')}
            name="pronouns"
            type="text"
            value={draft.pronouns}
            onChange={handleChangeInput}
          />
          <CheckBox
            name={String(t('friends_only.pronouns'))}
            checked={draft.pronouns_friends_only}
            onChange={() => handleToggleVisibility('pronouns_friends_only')}
          />
        </Layout.FlexCol>

        {/* bio */}
        <Layout.FlexCol gap={4} w="100%">
          <ValidatedTextArea
            label={t('bio')}
            name="bio"
            value={draft.bio}
            onChange={handleChangeTextArea}
            limit={120}
          />
          <CheckBox
            name={String(t('friends_only.bio'))}
            checked={draft.bio_friends_only}
            onChange={() => handleToggleVisibility('bio_friends_only')}
          />
        </Layout.FlexCol>

        {/* Chip Categories (7 categories) — each with its own visibility */}
        {ALL_CATEGORIES.map((categoryInfo) => (
          <Layout.FlexCol key={categoryInfo.key} gap={4} w="100%">
            <ChipCategorySection
              categoryInfo={categoryInfo}
              selectedChips={draft.chipSelections[categoryInfo.key] || []}
              customChips={draft.customChips}
              onToggleChip={handleToggleChip}
              onAddCustomChip={handleAddCustomChip}
              onRemoveCustomChip={handleRemoveCustomChip}
            />
            <CheckBox
              name={`Show ${categoryInfo.label} only to friends`}
              checked={draft.interests_friends_only}
              onChange={() => handleToggleVisibility('interests_friends_only')}
            />
          </Layout.FlexCol>
        ))}
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
