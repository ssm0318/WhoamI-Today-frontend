import { useTranslation } from 'react-i18next';
import MainContainer from '@components/_common/main-container/MainContainer';
import NewNoteContent from '@components/note/new-note-content/NewNoteContent';
import NewNoteHeader from '@components/note/new-note-header/NewNoteHeader';

function NewNote() {
  const [t] = useTranslation('translation', { keyPrefix: 'notes.new_note_header' });
  return (
    <MainContainer>
      <NewNoteHeader title={t('new_note')} />
      <NewNoteContent />
    </MainContainer>
  );
}

export default NewNote;
