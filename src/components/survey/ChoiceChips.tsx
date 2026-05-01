import styled from 'styled-components';

import { Layout } from '@design-system';

import { Chip } from './Chip.styled';

const ChipsRow = styled(Layout.FlexRow)`
  flex-wrap: wrap;
  gap: 8px;
`;

interface ChoiceChipsProps {
  options: { value: number; label: string }[];
  multi: boolean;
  selected: number | number[] | null;
  onSelect: (v: number | number[]) => void;
}

export function ChoiceChips({ options, multi, selected, onSelect }: ChoiceChipsProps) {
  const isSelected = (value: number) => {
    if (Array.isArray(selected)) return selected.includes(value);
    return selected === value;
  };

  const handleClick = (value: number) => {
    if (multi) {
      const current = Array.isArray(selected) ? selected : [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      onSelect(next);
    } else {
      onSelect(value);
    }
  };

  return (
    <ChipsRow>
      {options.map((o) => (
        <Chip
          key={o.value}
          type="button"
          selected={isSelected(o.value)}
          onClick={() => handleClick(o.value)}
        >
          {o.label}
        </Chip>
      ))}
    </ChipsRow>
  );
}
