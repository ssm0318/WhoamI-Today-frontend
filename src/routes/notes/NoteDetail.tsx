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
import { Note } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getNoteDetail } from '@utils/apis/note';

export function NoteDetail() {
  const { noteId } = useParams();
  const [t] = useTranslation('translation', { keyPrefix: 'note_detail' });
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const [noteDetail, setNoteDetail] = useState<Note | null>(null);
  const isMyPage = noteDetail?.author_detail.id === myProfile?.id;

  useAsyncEffect(async () => {
    if (!noteId) return;
    setNoteDetail(await getNoteDetail(Number(noteId)));
  }, [noteId]);

  if (!noteDetail) return <Loader />;

  const { username } = noteDetail.author_detail;

  return (
    <MainContainer>
      <SubHeader title={t('title', { username })} />
      <Layout.FlexCol w="100%" alignItems="center" mt={TITLE_HEADER_HEIGHT + 12} ph={16}>
        <NoteItem note={noteDetail} isMyPage={isMyPage} enableCollapse={false} type="DETAIL" />
      </Layout.FlexCol>
      <Layout.FlexCol w="100%" flex={1}>
        <CommentList postType="Note" post={noteDetail} />
      </Layout.FlexCol>
    </MainContainer>
  );
}
