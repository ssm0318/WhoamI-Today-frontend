import { useState } from 'react';
import { TextareaAutosizeProps } from 'react-textarea-autosize';
import { Layout } from '@design-system';
import { Typo } from '../Font';
import { FontType } from '../Font/Font.types';
import { CommonTextArea, CommonTextAreaProps } from './TextArea.styled';

export type TextAreaProps = {
  label?: string | null;
  labelType?: FontType;
  limit?: number;
} & CommonTextAreaProps &
  TextareaAutosizeProps;

function TextArea(props: TextAreaProps) {
  const { label, labelType = 'title-medium', limit, ...inputProps } = props;
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => setIsFocused(false);

  const textLength = inputProps.value ? String(inputProps.value)?.length : 0;

  return (
    <>
      {label && (
        <Typo type={labelType} color={isFocused ? 'BLACK' : 'MEDIUM_GRAY'}>
          {label}
        </Typo>
      )}
      <CommonTextArea {...inputProps} onFocus={handleFocus} onBlur={handleBlur} maxLength={limit} />
      {limit && (
        <Layout.FlexRow w="100%" justifyContent="flex-end" mt={4}>
          <Typo type="label-small" color="DARK_GRAY">
            {textLength || 0} / {limit}
          </Typo>
        </Layout.FlexRow>
      )}
    </>
  );
}

export { TextArea };
