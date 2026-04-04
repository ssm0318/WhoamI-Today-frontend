import { MouseEvent } from 'react';
import styled from 'styled-components';
import { CHIP_CATEGORIES, ChipCategory } from '@models/chips';

interface Props {
  label: string;
  category: ChipCategory;
  isSelected?: boolean;
  isCustom?: boolean;
  onClick?: (e: MouseEvent) => void;
}

function CategoryChip({ label, category, isSelected = false, isCustom = false, onClick }: Props) {
  const { colors } = CHIP_CATEGORIES[category];

  return (
    <ChipContainer
      $bgColor={isSelected ? colors.bg : '#FFFFFF'}
      $borderColor={isSelected ? colors.border : '#E0E0E0'}
      $textColor={isSelected ? colors.text : '#757575'}
      $isSelected={isSelected}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {isCustom && <CustomIndicator $color={colors.text}>+</CustomIndicator>}
      <ChipLabel>{label}</ChipLabel>
    </ChipContainer>
  );
}

const ChipContainer = styled.div<{
  $bgColor: string;
  $borderColor: string;
  $textColor: string;
  $isSelected: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1.5px solid ${({ $borderColor }) => $borderColor};
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ $textColor }) => $textColor};
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
  font-size: 14px;
  font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
  line-height: 20px;

  &:active {
    opacity: 0.8;
  }
`;

const ChipLabel = styled.span`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CustomIndicator = styled.span<{ $color: string }>`
  font-weight: 700;
  font-size: 14px;
  color: ${({ $color }) => $color};
`;

export default CategoryChip;
