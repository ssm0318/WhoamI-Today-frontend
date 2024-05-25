import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
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
  const [t] = useTranslation('translation', { keyPrefix: 'note_detail' });
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const [noteDetail, setNoteDetail] = useState<FetchState<Note>>({ state: 'loading' });

  useAsyncEffect(async () => {
    if (!noteId) return;

    try {
      const data = await getNoteDetail(Number(noteId));
      setNoteDetail({ state: 'hasValue', data });
    } catch (e) {
      // TODO
      setNoteDetail({ state: 'hasError' });
    }
  }, [noteId]);

  return (
    <MainContainer>
      {noteDetail.state === 'loading' && <Loader />}
      {noteDetail.state === 'hasValue' && (
        <>
          <SubHeader title={t('title', { username: noteDetail.data.author_detail.username })} />
          <Layout.FlexCol w="100%" alignItems="center" mt={TITLE_HEADER_HEIGHT + 12} ph={16}>
            <NoteItem
              note={noteDetail.data}
              isMyPage={noteDetail.data.author_detail.id === myProfile?.id}
              enableCollapse={false}
              type="DETAIL"
            />
          </Layout.FlexCol>
          <Layout.FlexCol w="100%" flex={1}>
            <CommentList postType="Note" post={noteDetail.data} />
          </Layout.FlexCol>
        </>
      )}
      {/* TODO: 에러 대응(접근 불가) */}
    </MainContainer>
  );
}
