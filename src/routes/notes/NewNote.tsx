import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import NewNoteHeader from '@components/note/new-note-header/NewNoteHeader';
import { NewNoteForm } from '@models/post';
import { CroppedImg } from '@utils/getCroppedImg';
import NewNoteContent from '../../components/note/new-note-content/NewNoteContent';

function NewNote() {
  const location = useLocation();
  const [t] = useTranslation('translation', { keyPrefix: 'notes.note_header' });

  const title = !location.state ? t('new_note') : t('edit_note');
  const noteId = location.state?.post.id || '';
  const content = location.state?.post.content || '';
  const images = useMemo(() => location.state?.post.images || [], [location.state?.post.images]);

  const [noteInfo, setNoteInfo] = useState<NewNoteForm>({ content, images: [] });

  const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  };

  useEffect(() => {
    if (location.state) {
      const convertImagesToFiles = async () => {
        const filePromises = images.map(async (image: string, index: number) => {
          const file = await urlToFile(image, `image${index}.jpg`, 'image/jpeg');
          const url = URL.createObjectURL(file);
          return { file, url } as CroppedImg;
        });

        const fileObjects = await Promise.all(filePromises);
        setNoteInfo((prevNoteInfo) => ({
          ...prevNoteInfo,
          images: fileObjects,
        }));
      };

      convertImagesToFiles();
    }
  }, [images, location.state]);

  return (
    <MainContainer>
      <NewNoteHeader noteId={noteId} title={title} noteInfo={noteInfo} />
      <NewNoteContent noteInfo={noteInfo} setNoteInfo={setNoteInfo} />
    </MainContainer>
  );
}

export default NewNote;
