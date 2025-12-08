import { Typo } from '@design-system';
import { ChipContainer } from './FilterChip.styled';

interface FilterChipProps {
  isSelected: boolean;
  onClick: () => void;
  label?: string;
}

function FilterChip({ isSelected, onClick, label = 'Filter' }: FilterChipProps) {
  return (
    <ChipContainer isSelected={isSelected} onClick={onClick}>
      <Typo type="body-medium" color="BLACK">
        {label}
      </Typo>
      {/* <SvgIcon name="chevron_down" size={16} color="BLACK" /> */}
    </ChipContainer>
  );
}

export default FilterChip;
