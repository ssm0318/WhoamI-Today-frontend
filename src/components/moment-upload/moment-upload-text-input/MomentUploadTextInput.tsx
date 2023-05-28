import { ChangeEvent, useRef } from 'react';
import { SCREEN_WIDTH } from '@constants/layout';
import { Font, Layout } from '@design-system';
import * as S from './MomentUploadTextInput.styled';

interface MomentUploadTextInputProps {
  setInput: (input: string) => void;
  placeholder?: string;
  maxLength?: number;
}

function MomentUploadTextInput({ setInput, placeholder, maxLength }: MomentUploadTextInputProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (maxLength && e.target.value.length > maxLength) return;
    setInput(e.target.value);
  };
  return (
    <Layout.FlexRow
      h={SCREEN_WIDTH}
      w="100%"
      bgColor="BASIC_WHITE"
      rounded={14}
      p={30}
      style={{
        position: 'relative',
      }}
    >
      <Layout.FlexRow w="100%">
        <Layout.FlexRow bgColor="RESPONSE_INPUT_DIVIDER" h={18} w={1} mr={12} />
        <S.InputContainer
          onChange={handleChangeInput}
          placeholder={placeholder}
          ref={textAreaRef}
          maxLength={maxLength}
        />
      </Layout.FlexRow>
      {textAreaRef.current && maxLength && (
        <Layout.Absolute b={34} r={24}>
          <Font.Display type="14_regular" color="GRAY_5">
            {textAreaRef.current.value.length} / {maxLength}
          </Font.Display>
        </Layout.Absolute>
      )}
    </Layout.FlexRow>
  );
}

export default MomentUploadTextInput;
