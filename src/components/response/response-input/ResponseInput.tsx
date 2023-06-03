import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, SvgIcon } from '@design-system';
import * as S from './ResponseInput.styled';

interface ResponseInputProps {
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

function ResponseInput({ inputRef }: ResponseInputProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'question.response' });

  return (
    <Layout.FlexRow pt={22} pb={20} w="100%" alignItems="flex-start">
      <SvgIcon name="my_profile" size={36} />
      <Layout.FlexRow pt={6} w="100%" ml={12}>
        <Layout.FlexRow bgColor="RESPONSE_INPUT_DIVIDER" h={18} w={1} mr={12} />
        <S.ResponseTextInput ref={inputRef} placeholder={t('placeholder') || undefined} autoFocus />
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default ResponseInput;
