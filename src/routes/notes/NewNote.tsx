import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import NewNoteHeader from '@components/note/new-note-header/NewNoteHeader';
import { NewNoteForm } from '@models/post';
import NewNoteContent from '../../components/note/new-note-content/NewNoteContent';

function NewNote() {
  const location = useLocation();
  const [t] = useTranslation('translation', { keyPrefix: 'notes.note_header' });

  const title = !location.state ? t('new_note') : t('edit_note');
  const content = location.state?.post.content || '';
  const images = location.state?.post.images || [];
  const [noteInfo, setNoteInfo] = useState<NewNoteForm>({ content, images });

  return (
    <MainContainer>
      <NewNoteHeader title={title} noteInfo={noteInfo} />
      <NewNoteContent noteInfo={noteInfo} setNoteInfo={setNoteInfo} />
    </MainContainer>
  );
}

export default NewNote;
