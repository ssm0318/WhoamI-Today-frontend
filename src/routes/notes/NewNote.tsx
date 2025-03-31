import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import NewNoteHeader from '@components/note/new-note-header/NewNoteHeader';
import { FeatureFlagKey } from '@constants/featureFlag';
import { NewNoteForm, PostVisibility } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { convertImagesToFiles } from '@utils/convertImageToFiles';
import NewNoteContent from '../../components/note/new-note-content/NewNoteContent';
import { MainScrollContainer } from '../Root';

function NewNote() {
  const location = useLocation();
  const [t] = useTranslation('translation', { keyPrefix: 'notes.note_header' });
  const featureFlags = useBoundStore((state) => state.featureFlags);

  const status = location.state?.status;
  // location.state가 없으면 새 노트, 있으면 수정 노트
  const title = !location.state ? t('new_note') : t('edit_note');
  const noteId = location.state?.post.id || '';
  const content = location.state?.post.content || '';
  const visibility =
    location.state?.post.visibility ||
    featureFlags?.[FeatureFlagKey.POST_VISIBILITY_DEFAULT_CLOSE_FRIEND]
      ? PostVisibility.CLOSE_FRIENDS
      : PostVisibility.FRIENDS;
  const images = useMemo(() => location.state?.post.images || [], [location.state?.post.images]);

  const [noteInfo, setNoteInfo] = useState<NewNoteForm>({ content, images: [], visibility });

  useEffect(() => {
    if (location.state) {
      convertImagesToFiles(images, setNoteInfo);
    }
  }, [images, location.state]);

  return (
    <MainScrollContainer>
      <NewNoteHeader noteId={noteId} title={title} noteInfo={noteInfo} status={status} />
      <NewNoteContent noteInfo={noteInfo} setNoteInfo={setNoteInfo} />
    </MainScrollContainer>
  );
}

export default NewNote;
