import { InputProps } from 'src/design-system/Inputs/Input';

export type ValidatedInputProps = InputProps & {
  error?: string | null;
  guide?: string | null;
};
