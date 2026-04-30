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

  return (
    <Layout.FlexRow w="100%" gap={6} style={{ flexWrap: 'wrap' }}>
      {traits.map((trait) => {
        const matchedCat = categories.find((cat) =>
          cat.chips.some((c) => normalizeChipText(c) === normalizeChipText(trait.content)),
        );
        return (
          <CategoryChip
            key={trait.id}
            label={trait.content}
            category={matchedCat?.key ?? categories[0]?.key ?? ChipCategory.MUSIC_ENTERTAINMENT}
            isSelected
          />
        );
      })}
    </Layout.FlexRow>
  );
}

export default MutualTraitsList;
