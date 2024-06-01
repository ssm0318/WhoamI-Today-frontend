import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainContainer from '@components/_common/main-container/MainContainer';
import NewNoteHeader from '@components/note/new-note-header/NewNoteHeader';
import { NewNoteForm } from '@models/post';
import NewNoteContent from '../../components/note/new-note-content/NewNoteContent';

function NewNote() {
  const [t] = useTranslation('translation', { keyPrefix: 'notes.new_note_header' });

  const [noteInfo, setNoteInfo] = useState<NewNoteForm>({ content: '', images: [] });

  return (
    <MainContainer>
      <NewNoteHeader title={t('new_note')} noteInfo={noteInfo} />
      <NewNoteContent noteInfo={noteInfo} setNoteInfo={setNoteInfo} />
    </MainContainer>
  );
}

export default NewNote;
