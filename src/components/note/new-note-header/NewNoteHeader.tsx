import { AxiosError } from 'axios';
import { useState } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const cancelPost = () => {
    navigate('/my');
  };

  const confirmPost = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { id: newNoteId } = !noteId
        ? await postNote(noteInfo)
        : await patchNote(noteId, noteInfo);

      navigate(`/notes/${newNoteId}`, { state: 'new' });
      openToast({
        message: t(status === 'edit' ? 'updated' : 'posted'),
        actionText: t('view'),
      });
    } catch (e) {
      openToast({
        message: t(
          `${
            (e as AxiosError)?.response?.status === 413 ? 'too_large_file_error' : 'temporary_error'
          }`,
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canPost = !!noteInfo.content && !isSubmitting;

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
