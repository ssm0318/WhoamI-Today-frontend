import { useMemo, useState } from 'react';
import styled from 'styled-components';

import { Colors, Layout } from '@design-system';
import { SurveyOptionValue } from '@models/survey';

import { Chip } from './Chip.styled';

const ChipsRow = styled(Layout.FlexRow)`
  flex-wrap: wrap;
  gap: 8px;
`;

const CustomRow = styled(Layout.FlexRow)`
  width: 100%;
  max-width: 100%;
  flex: 1 0 100%;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const CustomInput = styled.input`
  min-width: 0;
  flex: 0 1 150px;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 14px;
  color: ${Colors.BLACK};
  outline: none;

  &:focus {
    border-color: ${Colors.PRIMARY};
  }
`;

const CustomActionButton = styled.button<{ $primary?: boolean }>`
  flex: 0 0 auto;
  border: 1px solid ${({ $primary }) => ($primary ? Colors.PRIMARY : Colors.LIGHT_GRAY)};
  border-radius: 8px;
  padding: 7px 10px;
  background: ${({ $primary }) => ($primary ? Colors.PRIMARY : Colors.WHITE)};
  color: ${({ $primary }) => ($primary ? Colors.WHITE : Colors.DARK_GRAY)};
  font-size: 14px;
  cursor: pointer;
`;

// Option value can be number (likert / ordinal scores) or string (category
// codes like "mission_suggest"). Mirrors backend SurveyOption.value
// JSONField — both shapes are valid per the schema.
interface ChoiceChipsProps {
  options: { value: SurveyOptionValue; label: string }[];
  multi: boolean;
  selected: SurveyOptionValue | SurveyOptionValue[] | null;
  onSelect: (v: SurveyOptionValue | SurveyOptionValue[]) => void;
  allowCustom?: boolean;
  customLabels?: {
    addOption?: string;
    placeholder?: string;
    add?: string;
    cancel?: string;
  };
}

const normalizeChoiceText = (value: string) => value.trim().replace(/\s+/g, ' ');

const normalizeForMatch = (value: string) => normalizeChoiceText(value).toLowerCase();

const defaultCustomLabels = {
  addOption: 'Add option',
  placeholder: 'Type an option',
  add: 'Add',
  cancel: 'Cancel',
};

export function ChoiceChips({
  options,
  multi,
  selected,
  onSelect,
  allowCustom = false,
  customLabels,
}: ChoiceChipsProps) {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customDraft, setCustomDraft] = useState('');
  const labels = { ...defaultCustomLabels, ...customLabels };

  const displayedOptions = useMemo(() => {
    if (!allowCustom) return options;
    const selectedValues = Array.isArray(selected)
      ? selected
      : selected !== null && selected !== undefined
      ? [selected]
      : [];
    const knownValues = new Set(options.map((option) => option.value));
    const customOptions = selectedValues
      .filter((value): value is string => typeof value === 'string' && !knownValues.has(value))
      .map((value) => ({ value, label: value }));
    return [...options, ...customOptions];
  }, [allowCustom, options, selected]);

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

  const commitCustom = () => {
    const normalized = normalizeChoiceText(customDraft);
    if (!normalized) return;
    const matchKey = normalizeForMatch(normalized);
    const existingOption = options.find(
      (option) =>
        normalizeForMatch(String(option.value)) === matchKey ||
        normalizeForMatch(option.label) === matchKey,
    );
    const value = existingOption?.value ?? normalized;
    if (multi) {
      const current = Array.isArray(selected) ? selected : [];
      if (!current.includes(value)) onSelect([...current, value]);
    } else {
      onSelect(value);
    }
    setCustomDraft('');
    setIsAddingCustom(false);
  };

  return (
    <ChipsRow>
      {displayedOptions.map((o) => (
        <Chip
          key={String(o.value)}
          type="button"
          selected={isSelected(o.value)}
          onClick={() => handleClick(o.value)}
        >
          {o.label}
        </Chip>
      ))}
      {allowCustom &&
        (isAddingCustom ? (
          <CustomRow>
            <CustomInput
              value={customDraft}
              maxLength={80}
              placeholder={labels.placeholder}
              autoFocus
              onChange={(event) => setCustomDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  commitCustom();
                }
                if (event.key === 'Escape') {
                  setCustomDraft('');
                  setIsAddingCustom(false);
                }
              }}
            />
            <CustomActionButton type="button" $primary onClick={commitCustom}>
              {labels.add}
            </CustomActionButton>
            <CustomActionButton
              type="button"
              onClick={() => {
                setCustomDraft('');
                setIsAddingCustom(false);
              }}
            >
              {labels.cancel}
            </CustomActionButton>
          </CustomRow>
        ) : (
          <Chip type="button" selected={false} onClick={() => setIsAddingCustom(true)}>
            {labels.addOption}
          </Chip>
        ))}
    </ChipsRow>
  );
}
