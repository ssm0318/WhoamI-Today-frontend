import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import NewNoteHeader from '@components/note/new-note-header/NewNoteHeader';
import { Mission } from '@components/share/MissionOfTheDay';
import { NewNoteForm, PostVisibility, ShareType } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { convertImagesToFiles } from '@utils/convertImageToFiles';
import { getLastVisibility, VisibilityMemoryKeys } from '@utils/visibilityMemory';
import NewNoteContent from '../../components/note/new-note-content/NewNoteContent';
import { MainScrollContainer } from '../Root';

function NewNote() {
  const location = useLocation();
  const [t] = useTranslation('translation', { keyPrefix: 'notes.note_header' });
  const { myProfile } = useBoundStore.getState();

  const status = location.state?.status;
  const shareType: ShareType | undefined = location.state?.shareType;
  const tmiPlaceholder: string | undefined = location.state?.tmiPlaceholder;
  const missionMode: boolean = location.state?.missionMode ?? false;
  const mission: Mission | undefined = location.state?.mission;
  const isEditing = location.state?.post != null;
  // location.state가 없으면 새 노트, 있으면 수정 노트
  const title = !isEditing ? t('new_note') : t('edit_note');
  const noteId = location.state?.post?.id || '';
  const content = location.state?.post?.content || '';
  const predetermined = myProfile?.is_public ? [PostVisibility.PUBLIC] : [PostVisibility.FRIENDS];
  // For NEW notes, prefer the user's last-picked share visibility (per the
  // "remember my last choice" rule). For EDITING an existing note, keep its
  // original visibility so we don't silently flip what they previously shared.
  const remembered = !isEditing ? getLastVisibility(VisibilityMemoryKeys.share.note) : undefined;
  const defaultVisibility = remembered ? [remembered as unknown as PostVisibility] : predetermined;
  const visibility = location.state?.post?.visibility || defaultVisibility;
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
        placeholder={tmiPlaceholder}
        missionMode={missionMode}
        mission={mission}
        isEditing={isEditing}
      />
    </MainScrollContainer>
  );
}

export default NewNote;
