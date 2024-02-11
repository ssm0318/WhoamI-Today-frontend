import { InputHTMLAttributes, useState } from 'react';
import { Layout } from '@design-system';
import { Typo } from '../Font';
import { FontType } from '../Font/Font.types';
import CommonInput, { CommonInputProps } from './Input.styled';

export type InputProps = {
  label: string;
  labelType?: FontType;
  limit?: number;
} & CommonInputProps &
  InputHTMLAttributes<HTMLInputElement>;

function Input(props: InputProps) {
  const { label, labelType = 'title-medium', limit, ...inputProps } = props;
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => setIsFocused(false);

  const textLength = inputProps.value ? String(inputProps.value)?.length : 0;

  return (
    <>
      <Typo type={labelType} color={isFocused ? 'BLACK' : 'MEDIUM_GRAY'}>
        {label}
      </Typo>
      <CommonInput {...inputProps} onFocus={handleFocus} onBlur={handleBlur} maxLength={limit} />
      {limit && inputProps.type === 'text' && (
        <Layout.FlexRow w="100%" justifyContent="flex-end" mt={4}>
          <Typo type="label-small" color="DARK_GRAY">
            {textLength || 0} / {limit}
          </Typo>
        </Layout.FlexRow>
      )}
    </>
  );
}

export { Input };
