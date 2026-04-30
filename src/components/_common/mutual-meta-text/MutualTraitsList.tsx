import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import CategoryChip from '@components/profile/chip/CategoryChip';
import { Layout, Typo } from '@design-system';
import { useChipCategories } from '@hooks/useChipCategories';
import { ChipCategory, normalizeChipText } from '@models/chips';
import { MutualTrait } from '@models/user';

interface MutualTraitsListProps {
  traits: MutualTrait[];
  isLoading: boolean;
  emptyText: string;
}

function MutualTraitsList({ traits, isLoading, emptyText }: MutualTraitsListProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });
  const { categories, isLoading: isCategoriesLoading } = useChipCategories();

  if (isLoading || isCategoriesLoading) {
    return (
      <Layout.FlexCol w="100%" alignItems="center" pv={16}>
        <Loader />
      </Layout.FlexCol>
    );
  }

  if (traits.length === 0) {
    return (
      <Layout.FlexCol w="100%" alignItems="center" pv={16}>
        <Typo type="label-medium" color="MEDIUM_GRAY">
          {emptyText}
        </Typo>
      </Layout.FlexCol>
    );
  }

  const groupedByCategory = categories
    .map((cat) => ({
      category: cat,
      traits: traits.filter((trait) =>
        cat.chips.some((c) => normalizeChipText(c) === normalizeChipText(trait.content)),
      ),
    }))
    .filter((group) => group.traits.length > 0);

  // Surface any traits that didn't match a category in their own group so a
  // legacy chip name (e.g. "NightOwl" vs categorized "Night Owl") doesn't
  // get silently dropped while still inflating the count in the trigger label.
  const matchedIds = new Set(groupedByCategory.flatMap((g) => g.traits.map((tr) => tr.id)));
  const unmatched = traits.filter((trait) => !matchedIds.has(trait.id));
  const fallbackCategoryKey = categories[0]?.key ?? ChipCategory.MUSIC_ENTERTAINMENT;

  return (
    <Layout.FlexCol w="100%" gap={12}>
      {groupedByCategory.map(({ category, traits: catTraits }) => (
        <Layout.FlexCol key={category.key} gap={6}>
          <Typo type="label-medium" color="MEDIUM_GRAY">
            {category.label}
          </Typo>
          <Layout.FlexRow w="100%" gap={6} style={{ flexWrap: 'wrap' }}>
            {catTraits.map((trait) => (
              <CategoryChip
                key={trait.id}
                label={trait.content}
                category={category.key}
                isSelected
              />
            ))}
          </Layout.FlexRow>
        </Layout.FlexCol>
      ))}
      {unmatched.length > 0 && (
        <Layout.FlexCol gap={6}>
          {groupedByCategory.length > 0 && (
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {t('mutual_traits_modal.other', { defaultValue: 'Other' })}
            </Typo>
          )}
          <Layout.FlexRow w="100%" gap={6} style={{ flexWrap: 'wrap' }}>
            {unmatched.map((trait) => (
              <CategoryChip
                key={trait.id}
                label={trait.content}
                category={fallbackCategoryKey}
                isSelected
              />
            ))}
          </Layout.FlexRow>
        </Layout.FlexCol>
      )}
    </Layout.FlexCol>
  );
}

export default MutualTraitsList;
