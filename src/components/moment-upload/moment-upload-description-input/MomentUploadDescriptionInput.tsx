import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, SvgIcon } from '@design-system';
import * as S from './MomentUploadDescriptionInput.styled';

interface MomentUploadDescriptionInputProps {
  description: string | null;
  setDescription: (description: string) => void;
}

const MAX_LENGTH = 20;

function MomentUploadDescriptionInput({
  description,
  setDescription,
}: MomentUploadDescriptionInputProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'moment_upload' });

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (MAX_LENGTH && e.target.value.length > MAX_LENGTH) return;
    setDescription(e.target.value);
  };
  return (
    <Layout.FlexRow
      w="100%"
      rounded={14}
      alignItems="flex-start"
      bgColor="BASIC_WHITE"
      ph={12}
      pv={24}
      h={170}
    >
      <Layout.FlexRow w="100%">
        <SvgIcon name="moment_description_normal" size={30} />
        <S.InputContainer
          onChange={handleChangeInput}
          placeholder={t('description_placeholder') || ''}
          value={description || ''}
          maxLength={MAX_LENGTH}
        />
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default MomentUploadDescriptionInput;
