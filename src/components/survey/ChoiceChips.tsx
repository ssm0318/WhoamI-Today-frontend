import styled from 'styled-components';

import { Layout } from '@design-system';
import { SurveyOptionValue } from '@models/survey';

import { Chip } from './Chip.styled';

const ChipsRow = styled(Layout.FlexRow)`
  flex-wrap: wrap;
  gap: 8px;
`;

// Option value can be number (likert / ordinal scores) or string (category
// codes like "mission_suggest"). Mirrors backend SurveyOption.value
// JSONField — both shapes are valid per the schema.
interface ChoiceChipsProps {
  options: { value: SurveyOptionValue; label: string }[];
  multi: boolean;
  selected: SurveyOptionValue | SurveyOptionValue[] | null;
  onSelect: (v: SurveyOptionValue | SurveyOptionValue[]) => void;
}

export function ChoiceChips({ options, multi, selected, onSelect }: ChoiceChipsProps) {
  const isSelected = (value: SurveyOptionValue) => {
    if (Array.isArray(selected)) return selected.includes(value);
    return selected === value;
  };

  const handleClick = (value: SurveyOptionValue) => {
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
