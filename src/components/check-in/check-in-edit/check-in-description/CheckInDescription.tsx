import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import { Layout } from '@design-system';
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
      <CheckInTextInput
        value={description}
        onChange={onChange}
        placeholder={t('description_placeholder') || ''}
      />
      {description && <DeleteButton onClick={onDelete} size={32} />}
    </Layout.FlexRow>
  );
}

export default CheckInDescription;
