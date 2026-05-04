import { useCallback, useState } from 'react';

import { BotMultiSelectOption } from '@models/chat';
import * as S from './MultiSelectCard.styled';

interface Props {
  options: BotMultiSelectOption[];
  submitLabel: string;
  minSelection: number;
  maxSelection: number | null;
  disabled?: boolean;
  onSubmit: (selected: string[]) => void;
}

function MultiSelectCard({
  options,
  submitLabel,
  minSelection,
  maxSelection,
  disabled,
  onSubmit,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = useCallback(
    (value: string) => {
      if (submitted || disabled) return;
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(value)) {
          next.delete(value);
        } else {
          if (maxSelection !== null && next.size >= maxSelection) return prev;
          next.add(value);
        }
        return next;
      });
    },
    [submitted, disabled, maxSelection],
  );

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    onSubmit(Array.from(selected));
  }, [submitted, onSubmit, selected]);

  const canSubmit = !submitted && !disabled && selected.size >= minSelection;

  return (
    <S.Container>
      {options.map((opt) => (
        <Option
          key={opt.value}
          option={opt}
          checked={selected.has(opt.value)}
          disabled={submitted || disabled}
          onToggle={toggle}
        />
      ))}
      <S.SubmitButton type="button" disabled={!canSubmit} onClick={handleSubmit}>
        {submitted ? 'Submitted ✓' : submitLabel}
      </S.SubmitButton>
    </S.Container>
  );
}

interface OptionProps {
  option: BotMultiSelectOption;
  checked: boolean;
  disabled?: boolean;
  onToggle: (value: string) => void;
}

function Option({ option, checked, disabled, onToggle }: OptionProps) {
  return (
    <S.OptionRow>
      <S.Checkbox
        checked={checked}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={() => onToggle(option.value)}
        disabled={disabled}
      />
      {option.label}
    </S.OptionRow>
  );
}

export default MultiSelectCard;
