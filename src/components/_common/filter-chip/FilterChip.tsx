import { Layout, SvgIcon, Typo } from '@design-system';
import { ChipContainer } from './FilterChip.styled';

interface FilterChipProps {
  isSelected: boolean;
  onClick: () => void;
  label?: string;
}

function FilterChip({ isSelected, onClick, label = 'Filter' }: FilterChipProps) {
  return (
    <ChipContainer isSelected={isSelected} onClick={onClick}>
      <Layout.FlexRow justifyContent="center" alignItems="center">
        {isSelected && <SvgIcon name="tick" size={16} />}
      </Layout.FlexRow>
      <Typo type="body-medium" color="BLACK">
        {label}
      </Typo>
    </ChipContainer>
  );
}

export default FilterChip;
