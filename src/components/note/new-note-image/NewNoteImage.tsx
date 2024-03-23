import React from 'react';
import { Layout, SvgIcon } from '@design-system';
import { Note } from '@models/note';

interface NoteImageViewProps {
  url?: string;
  noteImages?: string[];
  setNoteInfo: React.Dispatch<React.SetStateAction<Partial<Note>>>;
}

function NewNoteImage({ url, noteImages, setNoteInfo }: NoteImageViewProps) {
  const onImageDelete = () => {
    if (noteImages) {
      setNoteInfo((prevNoteInfo) => ({
        ...prevNoteInfo,
        image: prevNoteInfo?.image?.filter((img) => img !== url) || [],
      }));
    }
  };

  return (
    <>
      <Layout.FlexRow justifyContent="center" gap={10} alignItems="center" ph={16}>
        <img
          src={url}
          width={450}
          height={250}
          style={{ borderRadius: '17px' }}
          alt="note-images"
        />
      </Layout.FlexRow>
      <div style={{ position: 'absolute', left: '85%', top: '0%' }}>
        <SvgIcon name="delete_image" size={50} onClick={onImageDelete} />
      </div>
    </>
  );
}

export default NewNoteImage;
