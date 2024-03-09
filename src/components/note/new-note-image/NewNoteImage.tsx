interface NoteImageViewProps {
  url?: string;
}

function NewNoteImage({ url }: NoteImageViewProps) {
  return <div>{url}</div>;
}

export default NewNoteImage;
