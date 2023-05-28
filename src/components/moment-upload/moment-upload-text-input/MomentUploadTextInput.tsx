import { ChangeEvent } from 'react';
import { SCREEN_WIDTH } from '@constants/layout';
import { Layout } from '@design-system';
import * as S from './MomentUploadTextInput.styled';

interface MomentUploadTextInputProps {
  setInput: (input: string) => void;
  placeholder?: string;
}

function MomentUploadTextInput({ setInput, placeholder }: MomentUploadTextInputProps) {
  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  return (
    <Layout.FlexRow h={SCREEN_WIDTH} w="100%" bgColor="BASIC_WHITE" rounded={14} p={30}>
      <Layout.FlexRow w="100%">
        <Layout.FlexRow bgColor="RESPONSE_INPUT_DIVIDER" h={18} w={1} mr={12} />
        {/* TODO react text auto resize 적용 */}
        <S.InputContainer onChange={handleChangeInput} placeholder={placeholder} />
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default MomentUploadTextInput;
