import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { getAuthorProfileInfo } from '@components/_common/author-profile/AuthorProfile.helper';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import CommentList from '@components/comment-list/CommentList';
import NoteItem from '@components/note/note-item/NoteItem';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { Note } from '@models/post';
import { getNoteDetail } from '@utils/apis/note';

export function NoteDetail() {
  const { noteId } = useParams();
  const [t] = useTranslation('translation', { keyPrefix: 'note_detail' });

  const [noteDetail, setNoteDetail] = useState<Note | null>(null);

  useAsyncEffect(async () => {
    if (!noteId) return;
    setNoteDetail(await getNoteDetail(Number(noteId)));
  }, [noteId]);

  if (!noteDetail) return <Loader />;

  const { username } = getAuthorProfileInfo(noteDetail.author_detail);

  return (
    <MainContainer>
      <SubHeader title={t('title', { name: username })} />
      <Layout.FlexCol w="100%" alignItems="center" mt={TITLE_HEADER_HEIGHT + 12}>
        {/* TODO isMyPage 변경 */}
        <NoteItem note={noteDetail} isMyPage={false} enableCollapse={false} />
      </Layout.FlexCol>
      <Layout.FlexCol w="100%" flex={1}>
        <CommentList postType="Note" post={noteDetail} />
      </Layout.FlexCol>
    </MainContainer>
  );
}
