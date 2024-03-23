import { Layout } from '@design-system';

interface NoteImageViewProps {
  url?: string;
}

function NewNoteImage({ url }: NoteImageViewProps) {
  return (
    <Layout.FlexRow justifyContent="center" gap={10} alignItems="center" ph={16}>
      <img src={url} width={450} height={250} style={{ borderRadius: '17px' }} alt="note-images" />
    </Layout.FlexRow>
  );
}

export default NewNoteImage;
