import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import NewNoteHeader from '@components/note/new-note-header/NewNoteHeader';
import { NewNoteForm } from '@models/post';
import { convertImagesToFiles } from '@utils/convertImageToFiles';
import NewNoteContent from '../../components/note/new-note-content/NewNoteContent';

function NewNote() {
  const location = useLocation();
  const [t] = useTranslation('translation', { keyPrefix: 'notes.note_header' });

  const status = location.state?.status;
  const title = !location.state ? t('new_note') : t('edit_note');
  const noteId = location.state?.post.id || '';
  const content = location.state?.post.content || '';
  const visibility = location.state?.post.visibility || 'friends';
  const images = useMemo(() => location.state?.post.images || [], [location.state?.post.images]);

  const [noteInfo, setNoteInfo] = useState<NewNoteForm>({ content, images: [], visibility });

  useEffect(() => {
    if (location.state) {
      convertImagesToFiles(images, setNoteInfo);
    }
  }, [images, location.state]);

  return (
    <MainContainer>
      <NewNoteHeader noteId={noteId} title={title} noteInfo={noteInfo} status={status} />
      <NewNoteContent noteInfo={noteInfo} setNoteInfo={setNoteInfo} />
    </MainContainer>
  );
}

export default NewNote;
