import { isAxiosError } from 'axios';
import { ChangeEvent, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import ProfileImageEdit from '@components/_common/profile-image-edit/ProfileImageEdit';
import ProfileImageEditButton from '@components/_common/profile-image-edit-button/ProfileImageEditButton';
import UploadLoadingOverlay from '@components/_common/upload-loading-overlay/UploadLoadingOverlay';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import ValidatedTextArea from '@components/_common/validated-textarea/ValidatedTextArea';
import ChipCategorySection from '@components/profile/chip/ChipCategorySection';
import { StyledEditProfileButton } from '@components/settings/SettingsButtons.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { CheckBox, Colors, Layout, Typo } from '@design-system';
import { useChipCategories } from '@hooks/useChipCategories';
import { useDelayedVisible } from '@hooks/useDelayedVisible';
import { MyProfile } from '@models/api/user';
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

function EditProfile() {
  type EditProfileTab = 'pronouns_bio' | 'interests';
  const location = useLocation();
  const isFromSignUp = !!location.state?.fromSignUp;
  const [searchParams] = useSearchParams();
  const isFromResetPassword = searchParams.get('from_reset_password') === 'true';
  const tabParam = searchParams.get('tab');
  const initialTab: EditProfileTab = tabParam === 'interests' ? 'interests' : 'pronouns_bio';
  const [t] = useTranslation('translation', { keyPrefix: 'settings.edit_profile' });
  const { myProfile, updateMyProfile, openToast, featureFlags } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    updateMyProfile: state.updateMyProfile,
    openToast: state.openToast,
    featureFlags: state.featureFlags,
  }));

  const { categories } = useChipCategories();
  const profileWithOptionalName = myProfile as MyProfile & {
    name?: string;
    name_friends_only?: boolean;
  };

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

  const [draft, setDraft] = useState<{
    bio: string;
    username: string;
    name: string;
    pronouns: string;
    chipSelections: Record<string, string[]>;
    customChips: CustomChip[];
    name_friends_only: boolean;
    pronouns_friends_only: boolean;
    bio_friends_only: boolean;
    categoryFriendsOnly: Record<string, boolean>;
  }>({
    bio: myProfile?.bio ?? '',
    username: myProfile?.username ?? '',
    name: profileWithOptionalName?.name ?? '',
    pronouns: myProfile?.pronouns ?? '',
    chipSelections: parsed.selections,
    customChips: parsed.customs,
    name_friends_only: profileWithOptionalName?.name_friends_only ?? true,
    pronouns_friends_only: myProfile?.pronouns_friends_only ?? false,
    bio_friends_only: myProfile?.bio_friends_only ?? false,
    categoryFriendsOnly: {
      music_entertainment: myProfile?.music_entertainment_friends_only ?? false,
      hobbies_activities: myProfile?.hobbies_activities_friends_only ?? false,
      on_my_mind: myProfile?.on_my_mind_friends_only ?? false,
      as_a_friend: myProfile?.as_a_friend_friends_only ?? false,
      online_persona: myProfile?.online_persona_friends_only ?? false,
      favorite_platform: myProfile?.favorite_platform_friends_only ?? false,
      least_favorite_platform: myProfile?.least_favorite_platform_friends_only ?? false,
    },
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

  const handleToggleVisibility = (field: string) => {
    setDraft((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleToggleCategoryVisibility = (categoryKey: string) => {
    setDraft((prev) => ({
      ...prev,
      categoryFriendsOnly: {
        ...prev.categoryFriendsOnly,
        [categoryKey]: !prev.categoryFriendsOnly[categoryKey],
      },
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
      name_friends_only: draft.name_friends_only,
      pronouns_friends_only: draft.pronouns_friends_only,
      bio_friends_only: draft.bio_friends_only,
      music_entertainment_friends_only: draft.categoryFriendsOnly.music_entertainment,
      hobbies_activities_friends_only: draft.categoryFriendsOnly.hobbies_activities,
      on_my_mind_friends_only: draft.categoryFriendsOnly.on_my_mind,
      as_a_friend_friends_only: draft.categoryFriendsOnly.as_a_friend,
      online_persona_friends_only: draft.categoryFriendsOnly.online_persona,
      favorite_platform_friends_only: draft.categoryFriendsOnly.favorite_platform,
      least_favorite_platform_friends_only: draft.categoryFriendsOnly.least_favorite_platform,
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
        if (isFromSignUp && shouldShowWidgetGuide(updatedProfile)) {
          navigate('/widget-install-guide', { replace: true });
        } else {
          navigate('/my');
        }
      },
      onError: (error) => {
        setIsSaving(false);
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
                name="name_friends_only"
                label={
                  <Trans
                    i18nKey="settings.edit_profile.friends_only.name"
                    components={{ token: <TokenTag /> }}
                  />
                }
                checked={draft.name_friends_only}
                onChange={() => handleToggleVisibility('name_friends_only')}
              />
            </Layout.FlexCol>

            <Layout.FlexCol gap={4} w="100%">
              <Layout.FlexCol w="100%" mb={4}>
                <ValidatedInput
                  label={t('pronouns')}
                  name="pronouns"
                  type="text"
                  value={draft.pronouns}
                  onChange={handleChangeInput}
                />
              </Layout.FlexCol>
              <CheckBox
                name="pronouns_friends_only"
                label={
                  <Trans
                    i18nKey="settings.edit_profile.friends_only.pronouns"
                    components={{ token: <TokenTag /> }}
                  />
                }
                checked={draft.pronouns_friends_only}
                onChange={() => handleToggleVisibility('pronouns_friends_only')}
              />
            </Layout.FlexCol>

            <Layout.FlexCol gap={4} w="100%">
              <ValidatedTextArea
                label={t('bio')}
                name="bio"
                value={draft.bio}
                onChange={handleChangeTextArea}
                limit={120}
              />
              <CheckBox
                name="bio_friends_only"
                label={
                  <Trans
                    i18nKey="settings.edit_profile.friends_only.bio"
                    components={{ token: <TokenTag /> }}
                  />
                }
                checked={draft.bio_friends_only}
                onChange={() => handleToggleVisibility('bio_friends_only')}
              />
            </Layout.FlexCol>
          </>
        ) : (
          <>
            {categories.map((categoryInfo) => (
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
                  name={`${categoryInfo.key}_friends_only`}
                  label={
                    <Trans
                      i18nKey="settings.edit_profile.friends_only.category"
                      values={{ label: categoryInfo.label }}
                      components={{ token: <TokenTag /> }}
                      tOptions={{ interpolation: { escapeValue: false } }}
                    />
                  }
                  checked={!!draft.categoryFriendsOnly[categoryInfo.key]}
                  onChange={() => handleToggleCategoryVisibility(categoryInfo.key)}
                />
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
  gap: 8px;
`;

const EditProfileTabButton = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? Colors.PRIMARY : Colors.LIGHT)};
  color: ${({ $active }) => ($active ? Colors.WHITE : Colors.DARK_GRAY)};
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  transition: background 0.15s ease, color 0.15s ease;
`;

const TokenTag = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  background-color: ${Colors.INPUT_GRAY};
  padding: 1px 5px;
  border-radius: 3px;
`;
