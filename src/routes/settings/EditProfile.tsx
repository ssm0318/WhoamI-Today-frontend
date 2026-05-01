import { isAxiosError } from 'axios';
import { ChangeEvent, ReactNode, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import ProfileImageEdit from '@components/_common/profile-image-edit/ProfileImageEdit';
import ProfileImageEditButton from '@components/_common/profile-image-edit-button/ProfileImageEditButton';
import UploadLoadingOverlay from '@components/_common/upload-loading-overlay/UploadLoadingOverlay';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import ValidatedTextArea from '@components/_common/validated-textarea/ValidatedTextArea';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import ChipCategorySection from '@components/profile/chip/ChipCategorySection';
import { StyledEditProfileButton } from '@components/settings/SettingsButtons.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import { useChipCategories } from '@hooks/useChipCategories';
import { useDelayedVisible } from '@hooks/useDelayedVisible';
import { MyProfile } from '@models/api/user';
import { ComponentVisibility } from '@models/checkIn';
import {
  ChipCategory,
  CustomChip,
  MAX_CUSTOM_CHIPS_PER_CATEGORY,
  normalizeChipText,
} from '@models/chips';
import { useBoundStore } from '@stores/useBoundStore';
import { createCustomChip, deleteCustomChip } from '@utils/apis/chips';
import { editProfile, updateChipsByCategory } from '@utils/apis/my';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import { shouldShowWidgetGuide } from '@utils/widgetInstallGuide';
import { MainScrollContainer } from '../Root';

const CATEGORY_KEYS = [
  'music_entertainment',
  'hobbies_activities',
  'on_my_mind',
  'as_a_friend',
  'online_persona',
  'favorite_platform',
  'least_favorite_platform',
  'basic_identities',
  'values_allyship',
] as const;

type CategoryKey = (typeof CATEGORY_KEYS)[number];

function EditProfile() {
  type EditProfileTab = 'pronouns_bio' | 'interests';
  const location = useLocation();
  const isFromSignUp = !!location.state?.fromSignUp;
  const [searchParams] = useSearchParams();
  const isFromResetPassword = searchParams.get('from_reset_password') === 'true';
  const tabParam = searchParams.get('tab');
  const initialTab: EditProfileTab = tabParam === 'interests' ? 'interests' : 'pronouns_bio';
  const [t] = useTranslation('translation', { keyPrefix: 'settings.edit_profile' });
  const [tVis] = useTranslation('translation', { keyPrefix: 'settings.edit_profile.visibility' });
  const { myProfile, updateMyProfile, openToast, featureFlags } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    updateMyProfile: state.updateMyProfile,
    openToast: state.openToast,
    featureFlags: state.featureFlags,
  }));

  const { categories } = useChipCategories();

  // Parse existing user chips into per-category selections
  const parseExistingChips = () => {
    const existing = [
      ...(myProfile?.user_interests ?? []).map((i) => i.replace(/^#+/, '')),
      ...(myProfile?.user_personas ?? []).map((p) => p.replace(/^#+/, '')),
    ];
    const result: Record<string, string[]> = {};
    const customResult: CustomChip[] = [];

    categories.forEach((cat) => {
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

  const initialCategoryVisibility = CATEGORY_KEYS.reduce((acc, key) => {
    acc[key] =
      (myProfile?.[`${key}_visibility` as keyof MyProfile] as ComponentVisibility | undefined) ??
      ComponentVisibility.PUBLIC;
    return acc;
  }, {} as Record<CategoryKey, ComponentVisibility>);

  const [draft, setDraft] = useState<{
    bio: string;
    username: string;
    name: string;
    pronouns: string;
    chipSelections: Record<string, string[]>;
    customChips: CustomChip[];
    name_visibility: ComponentVisibility;
    pronouns_visibility: ComponentVisibility;
    bio_visibility: ComponentVisibility;
    categoryVisibility: Record<CategoryKey, ComponentVisibility>;
  }>({
    bio: myProfile?.bio ?? '',
    username: myProfile?.username ?? '',
    name: myProfile?.name ?? '',
    pronouns: myProfile?.pronouns ?? '',
    chipSelections: parsed.selections,
    customChips: parsed.customs,
    name_visibility: myProfile?.name_visibility ?? ComponentVisibility.PUBLIC,
    pronouns_visibility: myProfile?.pronouns_visibility ?? ComponentVisibility.PUBLIC,
    bio_visibility: myProfile?.bio_visibility ?? ComponentVisibility.PUBLIC,
    categoryVisibility: initialCategoryVisibility,
  });

  const [usernameError, setUsernameError] = useState<string>();

  const inputRef = useRef<HTMLInputElement>(null);

  const [originalImageFileUrl, setOriginalImageFileURL] = useState<string>();
  const [croppedImg, setCroppedImg] = useState<CroppedImg>();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [, setImageChanged] = useState(false);
  const [activeTab, setActiveTab] = useState<EditProfileTab>(initialTab);
  const [isSaving, setIsSaving] = useState(false);
  const showUploadOverlay = useDelayedVisible(isSaving);

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
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 400) {
        openToast({
          message: `You can add up to ${MAX_CUSTOM_CHIPS_PER_CATEGORY} custom chips per category`,
        });
      } else {
        openToast({ message: 'Failed to add custom chip' });
      }
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

  const handleSetVisibility = (
    field: 'name_visibility' | 'pronouns_visibility' | 'bio_visibility',
    value: ComponentVisibility,
  ) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSetCategoryVisibility = (categoryKey: CategoryKey, value: ComponentVisibility) => {
    setDraft((prev) => ({
      ...prev,
      categoryVisibility: { ...prev.categoryVisibility, [categoryKey]: value },
    }));
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
      navigate(featureFlags?.checkInPosts ? '/feed' : '/friends');
    } else {
      navigate(-1);
    }
  };

  const handleClickSave = async () => {
    if (!myProfile || isSaving) return;

    setIsSaving(true);
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
      ...(!featureFlags?.postsVerQ && {
        name_visibility: draft.name_visibility,
        pronouns_visibility: draft.pronouns_visibility,
        bio_visibility: draft.bio_visibility,
        music_entertainment_visibility: draft.categoryVisibility.music_entertainment,
        hobbies_activities_visibility: draft.categoryVisibility.hobbies_activities,
        on_my_mind_visibility: draft.categoryVisibility.on_my_mind,
        as_a_friend_visibility: draft.categoryVisibility.as_a_friend,
        online_persona_visibility: draft.categoryVisibility.online_persona,
        favorite_platform_visibility: draft.categoryVisibility.favorite_platform,
        least_favorite_platform_visibility: draft.categoryVisibility.least_favorite_platform,
        basic_identities_visibility: draft.categoryVisibility.basic_identities,
        values_allyship_visibility: draft.categoryVisibility.values_allyship,
      }),
      ...(croppedImg ? { profile_image: croppedImg.file } : {}),
    };

    editProfile({
      profile: profileData,
      onSuccess: (data: MyProfile) => {
        setIsSaving(false);
        const updatedProfile = {
          ...data,
          profile_image: data.profile_image ?? myProfile?.profile_image,
        };
        updateMyProfile(updatedProfile);
        openToast({ message: t('response.updated') });
        if (shouldShowWidgetGuide(updatedProfile)) {
          navigate('/widget-install-guide', { replace: true });
        } else {
          navigate('/my');
        }
      },
      onError: (error, status) => {
        setIsSaving(false);
        if (error?.username) {
          return setUsernameError(t('username_valiation_error') || '');
        }
        if (status === 406 && error?.detail) {
          return setUsernameError(t('username_exists_error') || error.detail);
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

  const renderVisibilityRow = (label: string, control: ReactNode) =>
    !featureFlags?.postsVerQ && (
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center" gap={8}>
        <Typo type="label-medium" color="MEDIUM_GRAY">
          {label}
        </Typo>
        {control}
      </Layout.FlexRow>
    );

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
          <button type="button" onClick={handleClickSave} disabled={isSaving}>
            <Typo type="title-large" color={!isSaving ? 'PRIMARY' : 'LIGHT_GRAY'}>
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
        {!featureFlags?.postsVerQ && (
          <EditProfileTabRow w="100%">
            <EditProfileTabButton
              type="button"
              $active={activeTab === 'pronouns_bio'}
              onClick={() => setActiveTab('pronouns_bio')}
            >
              Pronouns/Bio
            </EditProfileTabButton>
            <EditProfileTabButton
              type="button"
              $active={activeTab === 'interests'}
              onClick={() => setActiveTab('interests')}
            >
              Interests
            </EditProfileTabButton>
          </EditProfileTabRow>
        )}

        {activeTab === 'pronouns_bio' || featureFlags?.postsVerQ ? (
          <>
            <ValidatedInput
              label={t('username')}
              name="username"
              type="text"
              value={draft.username}
              onChange={handleChangeInput}
              limit={20}
              error={usernameError}
            />

            <Layout.FlexCol gap={6} w="100%">
              <ValidatedInput
                label="Name"
                name="name"
                type="text"
                value={draft.name}
                onChange={handleChangeInput}
                limit={50}
              />
              {renderVisibilityRow(
                tVis('name'),
                <VisibilityToggle
                  value={draft.name_visibility}
                  onChange={(v) => handleSetVisibility('name_visibility', v)}
                />,
              )}
            </Layout.FlexCol>

            <Layout.FlexCol gap={6} w="100%">
              <ValidatedInput
                label={t('pronouns')}
                name="pronouns"
                type="text"
                value={draft.pronouns}
                onChange={handleChangeInput}
              />
              {renderVisibilityRow(
                tVis('pronouns'),
                <VisibilityToggle
                  value={draft.pronouns_visibility}
                  onChange={(v) => handleSetVisibility('pronouns_visibility', v)}
                />,
              )}
            </Layout.FlexCol>

            <Layout.FlexCol gap={6} w="100%">
              <ValidatedTextArea
                label={t('bio')}
                name="bio"
                value={draft.bio}
                onChange={handleChangeTextArea}
                limit={120}
              />
              {renderVisibilityRow(
                tVis('bio'),
                <VisibilityToggle
                  value={draft.bio_visibility}
                  onChange={(v) => handleSetVisibility('bio_visibility', v)}
                />,
              )}
            </Layout.FlexCol>
          </>
        ) : (
          <>
            {categories.map((categoryInfo) => (
              <Layout.FlexCol key={categoryInfo.key} gap={6} w="100%">
                <ChipCategorySection
                  categoryInfo={categoryInfo}
                  selectedChips={draft.chipSelections[categoryInfo.key] || []}
                  customChips={draft.customChips}
                  onToggleChip={handleToggleChip}
                  onAddCustomChip={handleAddCustomChip}
                  onRemoveCustomChip={handleRemoveCustomChip}
                />
                {renderVisibilityRow(
                  tVis('category', { label: categoryInfo.label }),
                  <VisibilityToggle
                    value={
                      draft.categoryVisibility[categoryInfo.key as CategoryKey] ??
                      ComponentVisibility.PUBLIC
                    }
                    onChange={(v) =>
                      handleSetCategoryVisibility(categoryInfo.key as CategoryKey, v)
                    }
                  />,
                )}
              </Layout.FlexCol>
            ))}
          </>
        )}
      </Layout.FlexCol>
      {isEditModalVisible && (
        <ProfileImageEdit
          setIsVisible={setIsEditModalVisible}
          image={originalImageFileUrl}
          onCompleteImageCrop={handleCompleteImageCrop}
          setImageChanged={setImageChanged}
        />
      )}
      <UploadLoadingOverlay visible={showUploadOverlay} />
    </MainScrollContainer>
  );
}

export default EditProfile;

const EditProfileTabRow = styled(Layout.FlexRow)`
  width: 100%;
  border-bottom: 1px solid ${Colors.LIGHT_GRAY};
  margin-bottom: 8px;
`;

const EditProfileTabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? Colors.PRIMARY : 'transparent')};
  color: ${({ $active }) => ($active ? Colors.BLACK : Colors.MEDIUM_GRAY)};
  padding: 12px 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  transition: color 0.15s ease, border-color 0.15s ease;
  margin-bottom: -1px;
`;
