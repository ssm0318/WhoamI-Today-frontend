import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import { Layout, SvgIcon, Typo } from '@design-system';
import { useChipCategories } from '@hooks/useChipCategories';
import { useTrackEvent } from '@hooks/useTrackEvent';
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
  const trackEvent = useTrackEvent();
  // Captured on every visible→hidden transition so we know how long the
  // user lingered on the chip categories. The bottom sheet stays mounted
  // even when hidden (animations) so we can't rely on unmount alone.
  const openedAtRef = useRef<number | null>(null);
  useEffect(() => {
    if (visible) {
      openedAtRef.current = Date.now();
      trackEvent('profile_more_about_opened', {
        is_my_page: isMyPage ? 'true' : 'false',
      });
    } else if (openedAtRef.current !== null) {
      const duration_ms = Date.now() - openedAtRef.current;
      openedAtRef.current = null;
      if (duration_ms >= 500) {
        trackEvent('profile_more_about_dwell', {
          is_my_page: isMyPage ? 'true' : 'false',
          duration_ms,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

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

  // Build a set of chip names (normalized) the viewer also has — used to highlight
  // shared traits in a distinct color. Mutual interests are category-specific so we
  // index by `${category}::${normalized name}`; mutual personas are name-only.
  const profileWithMutuals = user as Partial<UserProfile>;
  const sharedKeys = new Set<string>();
  (profileWithMutuals?.mutual_interests ?? []).forEach((m) => {
    const key = m.category
      ? `${m.category}::${normalizeChipText(m.content)}`
      : `*::${normalizeChipText(m.content)}`;
    sharedKeys.add(key);
  });
  const sharedPersonaNames = new Set(
    (profileWithMutuals?.mutual_personas ?? []).map((m) => normalizeChipText(m.content)),
  );

  const isChipShared = (chip: string, categoryKey: string): boolean => {
    if (sharedKeys.has(`${categoryKey}::${normalizeChipText(chip)}`)) return true;
    if (sharedKeys.has(`*::${normalizeChipText(chip)}`)) return true;
    if (categoryKey === 'online_persona' && sharedPersonaNames.has(normalizeChipText(chip)))
      return true;
    return false;
  };

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

  const hasAnySharedChip = groupedByCategory.some(({ category, chips }) =>
    chips.some((chip) => isChipShared(chip, category.key)),
  );

  return createPortal(
    <BottomModal visible={visible} onClose={onClose} draggable heightMode="full">
      <div style={{ width: '100%', backgroundColor: '#FCFCFC', borderBottom: '1px solid #F0F0F0' }}>
        <Layout.FlexRow w="100%" h={44} alignItems="center" justifyContent="center">
          <Typo type="title-medium" bold>
            {t('more_about', { username })}
          </Typo>
          {isMyPage && (
            <Layout.FlexRow
              onClick={handleClickEdit}
              style={{ cursor: 'pointer', position: 'absolute', right: 48 }}
            >
              <SvgIcon name="edit_filled" fill="DARK_GRAY" size={20} />
            </Layout.FlexRow>
          )}
        </Layout.FlexRow>
      </div>
      <Layout.FlexCol w="100%" ph={16} pv={16} gap={16}>
        {/* Legend for shared-trait highlighting (only when viewing a non-self
            profile and at least one trait overlaps with the viewer). */}
        {!isMyPage && hasAnySharedChip && (
          <Layout.FlexRow alignItems="center" gap={6}>
            <SharedSwatch />
            <Typo type="label-medium" color="MEDIUM_GRAY">
              shared with you
            </Typo>
          </Layout.FlexRow>
        )}

        {/* Chips grouped by category */}
        {groupedByCategory.map(({ category, chips }) => (
          <Layout.FlexCol key={category.key} gap={6}>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {category.label}
            </Typo>
            <Layout.FlexRow w="100%" gap={8} style={{ flexWrap: 'wrap' }}>
              {chips.map((chip) => (
                <CategoryChip
                  key={chip}
                  label={chip}
                  category={category.key}
                  isSelected
                  isShared={!isMyPage && isChipShared(chip, category.key)}
                />
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

const SharedSwatch = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background-color: #ffe6f4;
  border: 1px solid #ff00a8;
`;
