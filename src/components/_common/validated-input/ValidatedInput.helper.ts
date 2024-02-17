import { InputProps } from '@design-system';

export type ValidatedInputProps = InputProps & {
  error?: string | null;
  guide?: string | null;
  limit?: number;
};
