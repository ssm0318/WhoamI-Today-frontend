import styled from 'styled-components';
import { Typo } from '@design-system';
import {
  ChipCategory,
  ChipCategoryInfo,
  CustomChip,
  MAX_CUSTOM_CHIPS_PER_CATEGORY,
  normalizeChipText,
} from '@models/chips';
import AddCustomChipInput from './AddCustomChipInput';
import CategoryChip from './CategoryChip';

interface Props {
  categoryInfo: ChipCategoryInfo;
  selectedChips: string[];
  customChips: CustomChip[];
  onToggleChip: (category: ChipCategory, chipLabel: string) => void;
  onAddCustomChip: (category: ChipCategory, text: string) => void;
  onRemoveCustomChip: (category: ChipCategory, text: string) => void;
}

function ChipCategorySection({
  categoryInfo,
  selectedChips,
  customChips,
  onToggleChip,
  onAddCustomChip,
  onRemoveCustomChip,
}: Props) {
  const { key: category, label, description, chips } = categoryInfo;

  const categoryCustomChips = customChips.filter((c) => c.category === category);
  const canAddMore = categoryCustomChips.length < MAX_CUSTOM_CHIPS_PER_CATEGORY;

  const isChipSelected = (chipLabel: string) =>
    selectedChips.some((s) => normalizeChipText(s) === normalizeChipText(chipLabel));

  const handleAddCustom = (text: string) => {
    const alreadyExists =
      chips.some((c) => normalizeChipText(c) === normalizeChipText(text)) ||
      categoryCustomChips.some((c) => normalizeChipText(c.text) === normalizeChipText(text));

    if (alreadyExists) return;
    onAddCustomChip(category, text);
  };

  return (
    <SectionContainer>
      <SectionHeader>
        <Typo type="title-medium" color="BLACK">
          {label}
        </Typo>
        <Typo type="label-medium" color="MEDIUM_GRAY">
          {description}
        </Typo>
      </SectionHeader>
      <ChipGrid>
        {chips.map((chip) => (
          <CategoryChip
            key={chip}
            label={chip}
            category={category}
            isSelected={isChipSelected(chip)}
            onClick={() => onToggleChip(category, chip)}
          />
        ))}
        {categoryCustomChips.map((custom) => (
          <CategoryChip
            key={`custom-${custom.text}`}
            label={custom.text}
            category={category}
            isSelected
            isCustom
            onClick={() => onRemoveCustomChip(category, custom.text)}
          />
        ))}
        <AddCustomChipInput category={category} onAdd={handleAddCustom} disabled={!canAddMore} />
      </ChipGrid>
    </SectionContainer>
  );
}

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 0;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

export default ChipCategorySection;
