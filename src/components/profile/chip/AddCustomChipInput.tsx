import { KeyboardEvent, useRef, useState } from 'react';
import styled from 'styled-components';
import { CHIP_CATEGORIES, ChipCategory, MAX_CUSTOM_CHIP_LENGTH } from '@models/chips';

interface Props {
  category: ChipCategory;
  onAdd: (text: string) => void;
  disabled?: boolean;
}

function AddCustomChipInput({ category, onAdd, disabled = false }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { colors } = CHIP_CATEGORIES[category];

  const handleStartEditing = () => {
    if (disabled) return;
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed.length > 0 && trimmed.length <= MAX_CUSTOM_CHIP_LENGTH) {
      onAdd(trimmed);
    }
    setValue('');
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setValue('');
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (value.trim()) {
      handleSubmit();
    } else {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <InputContainer $borderColor={colors.border}>
        <StyledInput
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_CUSTOM_CHIP_LENGTH))}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Type here..."
          maxLength={MAX_CUSTOM_CHIP_LENGTH}
          $textColor={colors.text}
        />
      </InputContainer>
    );
  }

  return (
    <AddButton onClick={handleStartEditing} $disabled={disabled}>
      <span>+ Add your own</span>
    </AddButton>
  );
}

const InputContainer = styled.div<{ $borderColor: string }>`
  display: inline-flex;
  align-items: center;
  border: 1.5px solid ${({ $borderColor }) => $borderColor};
  border-radius: 20px;
  padding: 4px 12px;
  background-color: #ffffff;
`;

const StyledInput = styled.input<{ $textColor: string }>`
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 20px;
  width: 120px;
  color: ${({ $textColor }) => $textColor};
  background: transparent;

  &::placeholder {
    color: #bdbdbd;
  }
`;

const AddButton = styled.div<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1.5px dashed #bdbdbd;
  background-color: #fafafa;
  color: #9e9e9e;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  font-size: 14px;
  line-height: 20px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: ${({ $disabled }) => ($disabled ? 0.5 : 0.7)};
  }
`;

export default AddCustomChipInput;
