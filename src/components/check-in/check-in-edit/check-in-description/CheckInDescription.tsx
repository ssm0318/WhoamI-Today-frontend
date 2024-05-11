import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import { Layout, Typo } from '@design-system';
import CheckInTextInput from '../check-in-text-input/CheckInTextInput';

interface CheckInDescriptionProps {
  description: string;
  onDelete: () => void;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

function CheckInDescription({ description, onDelete, onChange }: CheckInDescriptionProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_edit' });
  return (
    <Layout.FlexRow mt={8} w="100%" alignItems="center" gap={8}>
      <Layout.FlexRow
        bgColor="WHITE"
        outline="LIGHT_GRAY"
        p={8}
        w="100%"
        rounded={12}
        alignItems="center"
        gap={4}
        h="100%"
      >
        <CheckInTextInput
          value={description}
          onChange={onChange}
          placeholder={t('description_placeholder') || ''}
          maxLength={DESCRIPTION_LENGTH_LIMIT}
        />
        <Layout.FlexRow h="100%" alignItems="flex-end">
          {description && (
            <Typo type="label-small" color="DARK_GRAY">
              {description.length} / {DESCRIPTION_LENGTH_LIMIT}
            </Typo>
          )}
        </Layout.FlexRow>
      </Layout.FlexRow>
      {description && <DeleteButton onClick={onDelete} size={32} />}
    </Layout.FlexRow>
  );
}

const DESCRIPTION_LENGTH_LIMIT = 50;

export default CheckInDescription;
