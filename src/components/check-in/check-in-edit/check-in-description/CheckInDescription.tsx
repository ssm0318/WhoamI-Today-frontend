import { ChangeEvent } from 'react';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import { Layout } from '@design-system';
import CheckInTextInput from '../check-in-text-input/CheckInTextInput';

interface CheckInDescriptionProps {
  description: string;
  onDelete: () => void;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

function CheckInDescription({ description, onDelete, onChange }: CheckInDescriptionProps) {
  return (
    <Layout.FlexRow mt={8} w="100%" alignItems="center" gap={8}>
      <CheckInTextInput
        value={description}
        onChange={onChange}
        placeholder="I had amazing ramen for lunch..."
      />
      {description && <DeleteButton onClick={onDelete} />}
    </Layout.FlexRow>
  );
}

export default CheckInDescription;
