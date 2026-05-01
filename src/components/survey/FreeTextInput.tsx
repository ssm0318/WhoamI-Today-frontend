import styled from 'styled-components';

import { Colors } from '@design-system';

const TextArea = styled.textarea`
  width: 100%;
  min-height: 96px;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
  color: ${Colors.BLACK};
  background: ${Colors.WHITE};
  &:focus {
    outline: none;
    border-color: ${Colors.PRIMARY};
  }
`;

interface Props {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}

export function FreeTextInput({ value, onChange, placeholder }: Props) {
  return (
    <TextArea value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  );
}
