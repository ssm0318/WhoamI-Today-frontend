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
import { MAX_WINDOW_WIDTH, TITLE_HEADER_HEIGHT, Z_INDEX } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';
import { useChipCategories } from '@hooks/useChipCategories';
import { useDelayedVisible } from '@hooks/useDelayedVisible';
import { useTrackEvent } from '@hooks/useTrackEvent';
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
import {
  getLastVisibility,
  setLastVisibility,
  VisibilityMemoryKeys,
} from '@utils/visibilityMemory';
import { shouldShowWidgetGuide } from '@utils/widgetInstallGuide';
import { MainScrollContainer } from '../Root';

// Hard cap on total profile chips a user can pick across all categories.
// Encourages curated selections — and prevents the "endless clicking" feeling
// in long lists like values_allyship.
const MAX_TOTAL_PROFILE_CHIPS = 20;

const CATEGORY_KEYS = [
  'basic_identities',
  'favorite_platform',
  'least_favorite_platform',
  'hobbies_activities',
  'music_entertainment',
  'values_allyship',
  'on_my_mind',
  'as_a_friend',
  'online_persona',
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

  // Parse existing user chips into per-category selections.
  //
  // Source of truth: `myProfile.chips_by_category` (keyed by category, set per Interest row).
  // The legacy flat arrays `user_interests`/`user_personas` lose the category attribution,
  // so a chip name shared across categories (e.g. "Instagram" appearing in both
  // favorite_platform and least_favorite_platform, or "Night Owl" in both basic_identities
  // and as_a_friend) would resolve to ALL matching categories — visible to users as
  // a chip wrongly selected in every category. Read from chips_by_category instead.
  const parseExistingChips = () => {
    const chipsByCategory = myProfile?.chips_by_category ?? {};
    const result: Record<string, string[]> = {};

    categories.forEach((cat) => {
      const stored = chipsByCategory[cat.key] ?? [];
      // Map each stored chip to its canonical-cased option, falling back to the stored
      // text (so chips removed from the option list still render as user-selected).
      result[cat.key] = stored.map(
        (m) => cat.chips.find((c) => normalizeChipText(c) === normalizeChipText(m)) || m,
      );
    });

    const customResult: CustomChip[] = (myProfile?.custom_chips ?? []).map((c) => ({
      id: c.id,
      text: c.text,
      category: c.category as ChipCategory,
    }));
    return { selections: result, customs: customResult };
  };

  const parsed = parseExistingChips();

  // Initial visibility per category: prefer the saved value (user's last
  // explicit choice on this category), then fall back to whatever they last
  // picked for any category, then to the predetermined default. Each category
  // remembers its own choice so they don't get synced across categories.
  const initialCategoryVisibility = CATEGORY_KEYS.reduce((acc, key) => {
    const saved = myProfile?.[`${key}_visibility` as keyof MyProfile] as
      | ComponentVisibility
      | undefined;
    acc[key] =
      saved ??
      getLastVisibility(VisibilityMemoryKeys.profile.chipCategory(key)) ??
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
    name_visibility:
      myProfile?.name_visibility ??
      getLastVisibility(VisibilityMemoryKeys.profile.name) ??
      ComponentVisibility.PUBLIC,
    pronouns_visibility:
      myProfile?.pronouns_visibility ??
      getLastVisibility(VisibilityMemoryKeys.profile.pronouns) ??
      ComponentVisibility.PUBLIC,
    bio_visibility:
      myProfile?.bio_visibility ??
      getLastVisibility(VisibilityMemoryKeys.profile.bio) ??
      ComponentVisibility.PUBLIC,
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
  const trackEvent = useTrackEvent();

  const handleToggleChip = (category: ChipCategory, chipLabel: string) => {
    setDraft((prev) => {
      const current = [...(prev.chipSelections[category] || [])];
      const isAlreadySelected = current.some(
        (c) => normalizeChipText(c) === normalizeChipText(chipLabel),
      );
      if (isAlreadySelected) {
        // Per-chip toggle event. Backend only sees the FINAL saved
        // selections; this captures pre-save fiddle (toggle on then off,
        // browse around, etc.). chip_label is bounded by the catalog so
        // cardinality is fine for Firebase.
        trackEvent('edit_profile_chip_toggled', {
          category: String(category),
          chip_label: chipLabel,
          value: 'off',
        });
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
      const totalSelected = Object.values(prev.chipSelections).reduce(
        (sum, list) => sum + list.length,
        0,
      );
      if (totalSelected >= MAX_TOTAL_PROFILE_CHIPS) {
        // Cap-hit signal: user wants to add more but hit the 20 limit.
        // Tells us how often the cap is in users' way.
        trackEvent('edit_profile_chip_cap_hit', {
          category: String(category),
        });
        openToast({
          message: `You can select up to ${MAX_TOTAL_PROFILE_CHIPS} chips total.`,
        });
        return prev;
      }
      trackEvent('edit_profile_chip_toggled', {
        category: String(category),
        chip_label: chipLabel,
        value: 'on',
      });
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
    const memoryKey =
      field === 'name_visibility'
        ? VisibilityMemoryKeys.profile.name
        : field === 'pronouns_visibility'
        ? VisibilityMemoryKeys.profile.pronouns
        : VisibilityMemoryKeys.profile.bio;
    setLastVisibility(memoryKey, value);
  };

  const handleSetCategoryVisibility = (categoryKey: CategoryKey, value: ComponentVisibility) => {
    setDraft((prev) => ({
      ...prev,
      categoryVisibility: { ...prev.categoryVisibility, [categoryKey]: value },
    }));
    setLastVisibility(VisibilityMemoryKeys.profile.chipCategory(categoryKey), value);
  };

  const handleClickUpdate = () => {
    // Avatar-picker entry. We can't detect whether the OS picker dialog
    // was confirmed vs cancelled — the cancel path returns no files
    // silently — so the picked / cropped events below are the funnel
    // continuation. Diff `_opened - _picked` ≈ 'opened then bailed'.
    trackEvent('avatar_picker_opened');
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

      // User actually picked a file from the gallery — distinct from
      // 'opened the picker but cancelled'. The cancel path silently
      // returns nothing in `e.target.files`, so we fire this only when
      // a file was selected.
      trackEvent('avatar_picker_picked');
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
    // User completed the crop and confirmed — only the actual save
    // (handled in the save flow below) is the final commit, but this is
    // the funnel-end of the picker UX.
    trackEvent('avatar_picker_cropped');
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
              onClick={() => {
                if (activeTab !== 'pronouns_bio') {
                  trackEvent('edit_profile_tab_changed', { tab: 'pronouns_bio' });
                }
                setActiveTab('pronouns_bio');
              }}
            >
              Pronouns/Bio
            </EditProfileTabButton>
            <EditProfileTabButton
              type="button"
              $active={activeTab === 'interests'}
              onClick={() => {
                if (activeTab !== 'interests') {
                  trackEvent('edit_profile_tab_changed', { tab: 'interests' });
                }
                setActiveTab('interests');
              }}
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
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {t('name_hint')}
              </Typo>
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
            {(() => {
              const total = Object.values(draft.chipSelections).reduce((s, l) => s + l.length, 0);
              const isOverCap = total > MAX_TOTAL_PROFILE_CHIPS;
              const isAtCap = total === MAX_TOTAL_PROFILE_CHIPS;
              return (
                <ChipCounterBar $tall={isOverCap}>
                  <Typo
                    type="label-medium"
                    color={isOverCap ? 'TERTIARY_PINK' : isAtCap ? 'PRIMARY' : 'DARK_GRAY'}
                    fontWeight={600}
                  >
                    {total} / {MAX_TOTAL_PROFILE_CHIPS} chips selected
                  </Typo>
                  {isOverCap && (
                    <Typo type="label-small" color="MEDIUM_GRAY">
                      Trim to {MAX_TOTAL_PROFILE_CHIPS} or fewer to add new chips.
                    </Typo>
                  )}
                </ChipCounterBar>
              );
            })()}
            <ChipsScrollArea>
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
                  {!featureFlags?.postsVerQ && (
                    <VisibilityToggle
                      value={
                        draft.categoryVisibility[categoryInfo.key as CategoryKey] ??
                        ComponentVisibility.PUBLIC
                      }
                      onChange={(v) =>
                        handleSetCategoryVisibility(categoryInfo.key as CategoryKey, v)
                      }
                    />
                  )}
                </Layout.FlexCol>
              ))}
            </ChipsScrollArea>
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

// Position fixed (not sticky) so the counter sits reliably below the SubHeader
// regardless of which scroll context is active or what overflow rules nearby
// flex containers might enforce. Centered to honor the app's MAX_WINDOW_WIDTH.
const CHIP_COUNTER_BAR_HEIGHT = 36;
// When the user has more chips selected than the cap (grandfathered legacy
// state), the bar grows to accommodate a hint line under the counter.
const CHIP_COUNTER_BAR_HEIGHT_TALL = 56;

const ChipCounterBar = styled.div<{ $tall?: boolean }>`
  position: fixed;
  top: ${TITLE_HEADER_HEIGHT}px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: ${MAX_WINDOW_WIDTH}px;
  height: ${({ $tall }) => ($tall ? CHIP_COUNTER_BAR_HEIGHT_TALL : CHIP_COUNTER_BAR_HEIGHT)}px;
  z-index: ${Z_INDEX.TITLE_HEADER - 1};
  padding: 8px 16px;
  background-color: ${Colors.WHITE};
  border-bottom: 1px solid ${Colors.LIGHT_GRAY};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

// Spacer pushes the chip categories below the fixed counter. Use the taller
// height so legacy over-cap users with a 2-line counter don't overlap the first
// chip section.
const ChipsScrollArea = styled.div`
  width: 100%;
  padding-top: ${CHIP_COUNTER_BAR_HEIGHT_TALL}px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
