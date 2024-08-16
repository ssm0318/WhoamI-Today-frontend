import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import CommonError from '@components/_common/common-error/CommonError';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import NoContents from '@components/_common/no-contents/NoContents';
import CommentList from '@components/comment-list/CommentList';
import NoteItem from '@components/note/note-item/NoteItem';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { Note } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getNoteDetail } from '@utils/apis/note';

export function NoteDetail() {
  const { noteId } = useParams();

  const [t] = useTranslation('translation');
  const navigate = useNavigate();

  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const [noteDetail, setNoteDetail] = useState<FetchState<Note>>({ state: 'loading' });
  const [reload, setReload] = useState<boolean>(false);

  useAsyncEffect(async () => {
    if (!noteId) return;

    try {
      const data = await getNoteDetail(Number(noteId));
      setNoteDetail({ state: 'hasValue', data });
    } catch (error) {
      if (isAxiosError(error)) {
        setNoteDetail({ state: 'hasError', error });
        return;
      }
      setNoteDetail({ state: 'hasError' });
    }
  }, [noteId, reload]);

  const handleGoBack = () => {
    navigate('/my');
  };

  return (
    <MainContainer>
      {noteDetail.state === 'loading' && <Loader />}
      {noteDetail.state === 'hasValue' && (
        <>
          <SubHeader
            title={t('note_detail.title', { username: noteDetail.data.author_detail?.username })}
            onGoBack={handleGoBack}
          />
          <Layout.FlexCol w="100%" alignItems="center" mt={TITLE_HEADER_HEIGHT + 12} ph={16}>
            <NoteItem
              note={noteDetail.data}
              isMyPage={noteDetail.data.author_detail?.id === myProfile?.id}
              commentType="DETAIL"
            />
          </Layout.FlexCol>
          <Layout.FlexCol w="100%" flex={1}>
            <CommentList postType="Note" post={noteDetail.data} setReload={setReload} />
          </Layout.FlexCol>
        </>
      )}
      {noteDetail.state === 'hasError' && (
        <>
          <SubHeader title={t('note_detail.error_title', { username: '' })} />
          <Layout.FlexCol w="100%" alignItems="center" mt={TITLE_HEADER_HEIGHT + 12} ph={16}>
            {!noteDetail.error || noteDetail.error.response?.status === 500 ? (
              <CommonError />
            ) : (
              <NoContents
                title={
                  noteDetail.error.response?.status === 403
                    ? t('no_contents.forbidden_post')
                    : t('no_contents.not_found_post')
                }
              />
            )}
          </Layout.FlexCol>
        </>
      )}
    </MainContainer>
  );
}
