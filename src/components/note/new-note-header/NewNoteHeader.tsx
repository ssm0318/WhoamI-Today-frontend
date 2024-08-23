import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Layout, Typo } from '@design-system';
import { NewNoteForm } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { patchNote, postNote } from '@utils/apis/note';
import { NewNoteHeaderWrapper } from './NewNoteHeader.styled';

interface NewNoteHeaderProps {
  status?: string;
  noteId: number;
  title: string;
  noteInfo: NewNoteForm;
}

function NewNoteHeader({ status, noteId, title, noteInfo }: NewNoteHeaderProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });

  const navigate = useNavigate();
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const cancelPost = () => {
    navigate('/my');
  };

  const confirmPost = async () => {
    const { id: newNoteId } = !noteId
      ? await postNote(noteInfo)
      : await patchNote(noteId, noteInfo);

    navigate('/my');
    openToast({
      message: t(status === 'edit' ? 'edited' : 'posted'),
      actionText: t('view'),
      action: () => navigate(`/notes/${newNoteId}`),
    });
  };

  const canPost = !!noteInfo.content;

  return (
    <NewNoteHeaderWrapper>
      <Layout.FlexRow justifyContent="space-between" w="100%" h="100%" alignItems="center">
        <Layout.FlexRow gap={8} alignItems="center" onClick={cancelPost}>
          <Typo type="title-large" color="BLACK">
            {t('cancel')}
          </Typo>
        </Layout.FlexRow>
        <Layout.FlexRow>
          <Typo type="head-line">{title}</Typo>
        </Layout.FlexRow>
        <Layout.FlexRow gap={8} alignItems="center">
          <button type="button" disabled={!canPost} onClick={confirmPost}>
            <Typo type="title-large" color={canPost ? 'PRIMARY' : 'MEDIUM_GRAY'}>
              {t('post')}
            </Typo>
          </button>
        </Layout.FlexRow>
      </Layout.FlexRow>
    </NewNoteHeaderWrapper>
  );
}

export default NewNoteHeader;
