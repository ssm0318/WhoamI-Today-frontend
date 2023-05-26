import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Divider from '@components/_common/divider/Divider';
import { Layout, SvgIcon } from '@design-system';
import * as S from './ResponseInput.styled';

function ResponseInput() {
  const [t] = useTranslation('translation', { keyPrefix: 'question.response' });

  const [response, setResponse] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setResponse(value);
  };

  const onKeySubmit = (e: KeyboardEvent) => {
    console.log(e);
  };

  return (
    <Layout.FlexRow pt={22} pb={20} w="100%" alignItems="flex-start">
      <SvgIcon name="my_profile" size={36} />
      <Divider horizontal={false} bgColor="RESPONSE_INPUT_DIVIDER" width={1} />
      <S.ResponseTextInput
        placeholder={t('placeholder') || undefined}
        value={response}
        onChange={handleChange}
        onKeyDown={onKeySubmit}
        multiple
      />
    </Layout.FlexRow>
  );
}

export default ResponseInput;
