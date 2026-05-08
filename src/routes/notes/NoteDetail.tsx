import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CommonError from '@components/_common/common-error/CommonError';
import NoContents from '@components/_common/no-contents/NoContents';
import CommentList from '@components/comment-list/CommentList';
import MissionGroupItemComponent from '@components/note/mission-group-item/MissionGroupItem';
import NoteItem from '@components/note/note-item/NoteItem';
import NoteLoader from '@components/note/note-loader/NoteLoader';
import SubHeader from '@components/sub-header/SubHeader';
import { BOTTOM_TABBAR_HEIGHT, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { useDwellTime } from '@hooks/useDwellTime';
import { FetchState } from '@models/api/common';
import { MissionGroupItem, Note, ShareType } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getMissionAttempts, getNoteDetail } from '@utils/apis/note';
import { userListApiPrefixForViewer } from '@utils/apis/userApiPrefix';
import { MainScrollContainer } from '../Root';

type DetailState =
  | { kind: 'note'; data: Note }
  | { kind: 'mission'; data: MissionGroupItem; initialAttemptId: number };

export function NoteDetail() {
  const { noteId } = useParams();

  const [t] = useTranslation('translation');
  const navigate = useNavigate();
  const location = useLocation();
  const { featureFlags, myProfile } = useBoundStore(UserSelector);
  const [detail, setDetail] = useState<FetchState<DetailState>>({ state: 'loading' });
  const [reload, setReload] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState(false);

  // Read time on a post — invisible to backend (the GET /notes/<id>/ call
  // doesn't tell us when the user left). Pairs naturally with engagement
  // measures: low dwell + reaction = "tapped emoji and left", high dwell
  // + no reaction = "read carefully but didn't engage."
  useDwellTime('note_detail_dwell', { note_id: Number(noteId) || 0 });

  useAsyncEffect(async () => {
    if (!noteId) return;
    const notesPrefix = userListApiPrefixForViewer(featureFlags?.postsVerQ, myProfile?.current_ver);
    try {
      const note = await getNoteDetail(Number(noteId), notesPrefix);
      if (note.share_type === ShareType.MISSION && note.mission_id) {
        const group = await getMissionAttempts(note.mission_id, note.author_detail?.id);
        if (group) {
          setDetail({
            state: 'hasValue',
            data: { kind: 'mission', data: group, initialAttemptId: note.id },
          });
          if (reload) setReload(false);
          return;
        }
      }
      setDetail({ state: 'hasValue', data: { kind: 'note', data: note } });
      if (reload) setReload(false);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          navigate('/my');
          return;
        }
        setDetail({ state: 'hasError', error });
        return;
      }
      setDetail({ state: 'hasError' });
    }
  }, [noteId, reload, featureFlags?.postsVerQ, myProfile?.current_ver]);

  const isNew = location.state === 'new' || location.state?.new;
  const fromShare = location.state?.fromShare;

  const handleGoBack = () => {
    if (fromShare) {
      navigate('/share');
    } else {
      navigate('/my');
    }
  };

  const authorUsername =
    detail.state === 'hasValue'
      ? detail.data.kind === 'mission'
        ? detail.data.data.author_detail?.username
        : detail.data.data.author_detail?.username
      : undefined;

  // Comments are attributed to the latest attempt for mission groups
  const footerNote =
    detail.state === 'hasValue' && detail.data.kind === 'mission'
      ? detail.data.data.attempts[detail.data.data.attempts.length - 1]
      : detail.state === 'hasValue' && detail.data.kind === 'note'
      ? detail.data.data
      : null;

  return (
    <MainScrollContainer>
      <SubHeader
        title={authorUsername ? t('note_detail.title', { username: authorUsername }) : ''}
        onGoBack={isNew ? handleGoBack : undefined}
      />
      <Layout.FlexCol w="100%" alignItems="center" mt={12} ph={12}>
        {detail.state === 'loading' && <NoteLoader />}
        {detail.state === 'hasValue' && detail.data.kind === 'mission' && (
          <MissionGroupItemComponent
            group={detail.data.data}
            isMyPage={detail.data.data.author_detail?.id === myProfile?.id}
            displayType="DETAIL"
            initialAttemptId={detail.data.initialAttemptId}
            refresh={() => setReload(true)}
          />
        )}
        {detail.state === 'hasValue' && detail.data.kind === 'note' && (
          <NoteItem
            note={detail.data.data}
            isMyPage={detail.data.data.author_detail?.id === myProfile?.id}
            displayType="DETAIL"
            showMissionMeta={detail.data.data.share_type === ShareType.MISSION}
            refresh={() => setReload(true)}
          />
        )}
      </Layout.FlexCol>
      {detail.state === 'hasValue' && footerNote && (
        <Layout.FlexCol w="100%" flex={1}>
          <CommentList
            postType="Note"
            post={footerNote}
            setReload={setReload}
            inputFocus={inputFocus}
            setInputFocus={setInputFocus}
            bottomOffset={BOTTOM_TABBAR_HEIGHT}
          />
        </Layout.FlexCol>
      )}
      {detail.state === 'hasError' && (
        <>
          <SubHeader title={t('note_detail.error_title', { username: '' })} />
          <Layout.FlexCol w="100%" alignItems="center" mt={TITLE_HEADER_HEIGHT + 12} ph={16}>
            {!detail.error || detail.error.response?.status === 500 ? (
              <CommonError />
            ) : (
              <NoContents
                title={
                  detail.error.response?.status === 403
                    ? t('no_contents.forbidden_post')
                    : t('no_contents.not_found_post')
                }
              />
            )}
          </Layout.FlexCol>
        </>
      )}
    </MainScrollContainer>
  );
}
