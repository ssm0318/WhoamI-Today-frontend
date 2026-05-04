import styled from 'styled-components';

import { Layout } from '@design-system';

import { Chip } from './Chip.styled';

const ChipsRow = styled(Layout.FlexRow)`
  flex-wrap: wrap;
  gap: 8px;
`;

// Option values can be either int (likert / ordinal codes) or string
// (categorical codes like "yes" / "minor" / "mission_suggest"). The
// backend stores both as JSON; frontend just propagates the raw type.
type OptionValue = number | string;

interface ChoiceChipsProps {
  options: { value: OptionValue; label: string }[];
  multi: boolean;
  selected: OptionValue | OptionValue[] | null;
  onSelect: (v: OptionValue | OptionValue[]) => void;
}

export function ChoiceChips({ options, multi, selected, onSelect }: ChoiceChipsProps) {
  const isSelected = (value: OptionValue) => {
    if (Array.isArray(selected)) return (selected as OptionValue[]).includes(value);
    return selected === value;
  };

  const handleClick = (value: OptionValue) => {
    if (multi) {
      const current: OptionValue[] = Array.isArray(selected) ? (selected as OptionValue[]) : [];
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
          key={String(o.value)}
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
