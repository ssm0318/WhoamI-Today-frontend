import { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { mutate as globalMutate } from 'swr';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import UploadLoadingOverlay from '@components/_common/upload-loading-overlay/UploadLoadingOverlay';
import { Mission } from '@components/share/MissionOfTheDay';
import { Layout, Typo } from '@design-system';
import { useDelayedVisible } from '@hooks/useDelayedVisible';
import { MISSION_TODAY_KEY } from '@hooks/useMissionToday';
import { NoteDraftContext, useNoteDraft } from '@hooks/useNoteDraft';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { NewNoteForm, ShareType } from '@models/post';
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
  const showUploadOverlay = useDelayedVisible(isSubmitting);

  const navigate = useNavigate();
  const location = useLocation();
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const fromShare = location.state?.fromShare;
  const missionMode = !!location.state?.missionMode;
  const mission: Mission | undefined = location.state?.mission;
  const trackEvent = useTrackEvent();
  const publishedRef = useRef(false);
  const isEditing = !!noteId;

  const draftContext: NoteDraftContext = missionMode ? 'mission' : 'regular';
  const { clear: clearDraft } = useNoteDraft(draftContext, mission?.id ?? null, {
    disabled: isEditing,
  });
  const [discardDialogVisible, setDiscardDialogVisible] = useState(false);
  // Latest noteInfo via ref so the unmount cleanup checks the most recent
  // content/image state — unmount fires AFTER state is frozen.
  const noteInfoRef = useRef(noteInfo);
  noteInfoRef.current = noteInfo;

  useEffect(() => {
    trackEvent('note_compose_started', {
      mode: isEditing ? 'edit' : 'create',
      mission_mode: missionMode ? 'true' : 'false',
      from_share: fromShare ? 'true' : 'false',
    });
    return () => {
      if (publishedRef.current) return;
      // had_content distinguishes "opened then immediately backed out" from
      // "wrote / attached image then walked away" — different friction signals.
      const hasContent =
        !!noteInfoRef.current.content ||
        (noteInfoRef.current.images && noteInfoRef.current.images.length > 0);
      trackEvent('note_compose_abandoned', {
        mode: isEditing ? 'edit' : 'create',
        had_content: hasContent ? 'true' : 'false',
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateAway = () => {
    if (fromShare) {
      navigate('/share');
    } else {
      navigate(-1);
    }
  };

  const cancelPost = () => {
    const hasContent =
      !!noteInfoRef.current.content?.trim() ||
      (noteInfoRef.current.images && noteInfoRef.current.images.length > 0);
    if (!isEditing && hasContent) {
      setDiscardDialogVisible(true);
      return;
    }
    navigateAway();
  };

  const handleDiscardConfirm = () => {
    clearDraft();
    setDiscardDialogVisible(false);
    navigateAway();
  };

  const confirmPost = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload: NewNoteForm =
        missionMode && mission
          ? { ...noteInfo, share_type: ShareType.MISSION, mission_id: mission.id }
          : noteInfo;
      const { id: newNoteId } = !noteId
        ? await postNote(payload)
        : await patchNote(noteId, noteInfo);

      // Refresh today's mission counter so the Share card reflects the new attempt.
      if (missionMode && !noteId) {
        globalMutate(MISSION_TODAY_KEY);
      }

      clearDraft();
      publishedRef.current = true;
      trackEvent('note_compose_published', {
        mode: isEditing ? 'edit' : 'create',
        content_length: noteInfo.content?.length ?? 0,
        image_count: noteInfo.images?.length ?? 0,
        mission_mode: missionMode ? 'true' : 'false',
      });
      navigate(`/notes/${newNoteId}`, { state: { new: true, fromShare } });
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

  const canPost = (missionMode || !!noteInfo.content) && !isSubmitting;

  return (
    <>
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
      <UploadLoadingOverlay visible={showUploadOverlay} />
      <CommonDialog
        visible={discardDialogVisible}
        title={t('discard_draft_title')}
        content={t('discard_draft_content')}
        cancelText={t('keep_editing')}
        confirmText={t('discard')}
        confirmTextColor="ERROR"
        onClickConfirm={handleDiscardConfirm}
        onClickCancel={() => setDiscardDialogVisible(false)}
        onClickClose={() => setDiscardDialogVisible(false)}
        trackingId="note_discard_draft"
      />
    </>
  );
}

export default NewNoteHeader;
