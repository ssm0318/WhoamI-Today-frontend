import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import NewNoteHeader from '@components/note/new-note-header/NewNoteHeader';
import { NewNoteForm, ShareType } from '@models/post';
import { convertImagesToFiles } from '@utils/convertImageToFiles';
import NewNoteContent from '../../components/note/new-note-content/NewNoteContent';
import { MainScrollContainer } from '../Root';

function NewNote() {
  const location = useLocation();
  const [t] = useTranslation('translation', { keyPrefix: 'notes.note_header' });

  const status = location.state?.status;
  const shareType: ShareType | undefined = location.state?.shareType;
  const isEditing = location.state?.post != null;
  // location.state가 없으면 새 노트, 있으면 수정 노트
  const title = !isEditing ? t('new_note') : t('edit_note');
  const noteId = location.state?.post?.id || '';
  const content = location.state?.post?.content || '';
  const visibility = location.state?.post?.visibility || [];
  const images = useMemo(() => location.state?.post?.images || [], [location.state?.post?.images]);

  const [noteInfo, setNoteInfo] = useState<NewNoteForm>({
    content,
    images: [],
    visibility,
    share_type: shareType,
  });

  useEffect(() => {
    if (isEditing) {
      convertImagesToFiles(images, setNoteInfo);
    }
  }, [images, isEditing]);

  return (
    <MainScrollContainer>
      <NewNoteHeader noteId={noteId} title={title} noteInfo={noteInfo} status={status} />
      <NewNoteContent
        noteInfo={noteInfo}
        setNoteInfo={setNoteInfo}
        autoOpenImagePicker={shareType === ShareType.PHOTO_OF_THE_DAY}
      />
    </MainScrollContainer>
  );
}

export default NewNote;
