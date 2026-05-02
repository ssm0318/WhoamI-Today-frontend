import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Icon from '@components/_common/icon/Icon';
import { Layout, SvgIcon, Typo } from '@design-system';
import { useChipCategories } from '@hooks/useChipCategories';
import { MyProfile } from '@models/api/user';
import { normalizeChipText } from '@models/chips';
import { UserProfile } from '@models/user';
import CategoryChip from '../chip/CategoryChip';

interface MoreAboutBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  user: UserProfile | MyProfile;
  username: string;
  isMyPage: boolean;
}

function MoreAboutBottomSheet({
  visible,
  onClose,
  user,
  username,
  isMyPage,
}: MoreAboutBottomSheetProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });
  const { categories } = useChipCategories();
  const navigate = useNavigate();

  const handleClickEdit = () => {
    onClose();
    navigate('/settings/edit-profile?tab=interests');
  };

  // Source of truth: `chips_by_category` (per-category Interest rows from backend).
  // The legacy flat `user_interests` array cannot disambiguate chip names that appear in
  // multiple categories (e.g. "Instagram" in both favorite_platform and least_favorite_platform),
  // so flat-list-against-cat.chips matching wrongly placed every shared chip into every
  // matching category. Read from chips_by_category instead.
  //
  // Custom chips (user-created) carry their own category attribution. Legacy `user_personas`
  // entries that match an `online_persona` chip are merged in for backward compatibility
  // with users whose persona selections predate the chip-by-category system.
  const chipsByCategory = user?.chips_by_category ?? {};
  const customChips = user?.custom_chips ?? [];
  const legacyPersonas = (user?.user_personas ?? []).map((p) => p.replace(/^#+/, ''));

  const groupedByCategory = categories
    .map((cat) => {
      const stored = chipsByCategory[cat.key] ?? [];
      const custom = customChips.filter((c) => c.category === cat.key).map((c) => c.text);
      const chips = [...stored, ...custom];

      if (cat.key === 'online_persona') {
        const storedNormalized = new Set(stored.map((s) => normalizeChipText(s)));
        const matchingPersonas = legacyPersonas.filter(
          (p) =>
            cat.chips.some((c) => normalizeChipText(c) === normalizeChipText(p)) &&
            !storedNormalized.has(normalizeChipText(p)),
        );
        chips.push(...matchingPersonas);
      }

      return { category: cat, chips };
    })
    .filter((group) => group.chips.length > 0);

  return createPortal(
    <BottomModal visible={visible} onClose={onClose}>
      <Layout.FlexCol w="100%" ph={16} pv={16} gap={16}>
        {/* Header */}
        <Layout.FlexRow w="100%" justifyContent="center" alignItems="center">
          <Icon name="home_indicator" />
        </Layout.FlexRow>
        <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
          <Typo type="title-large">{t('more_about', { username })}</Typo>
          {isMyPage && (
            <Layout.FlexRow onClick={handleClickEdit} style={{ cursor: 'pointer' }}>
              <SvgIcon name="edit_filled" fill="DARK_GRAY" size={20} />
            </Layout.FlexRow>
          )}
        </Layout.FlexRow>

        {/* Chips grouped by category */}
        {groupedByCategory.map(({ category, chips }) => (
          <Layout.FlexCol key={category.key} gap={6}>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {category.label}
            </Typo>
            <Layout.FlexRow w="100%" gap={8} style={{ flexWrap: 'wrap' }}>
              {chips.map((chip) => (
                <CategoryChip key={chip} label={chip} category={category.key} isSelected />
              ))}
            </Layout.FlexRow>
          </Layout.FlexCol>
        ))}
      </Layout.FlexCol>
    </BottomModal>,
    document.getElementById('modal-container') || document.body,
  );
}

export default MoreAboutBottomSheet;
