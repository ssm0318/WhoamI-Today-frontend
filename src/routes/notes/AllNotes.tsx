import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import NoContents from '@components/_common/no-contents/NoContents';
import NoteListItem from '@components/note/note-list-item/NoteListItem';
import SubHeader from '@components/sub-header/SubHeader';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { Note } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getMyNotes } from '@utils/apis/my';

function AllNotes() {
  const [t] = useTranslation('translation');
  const { username } = useParams();
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  const [noteList, setNoteList] = useState<Note[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchNotes(nextPage === undefined ? null : nextPage);
  });

  const fetchNotes = async (page: string | null) => {
    const { results, next } = await getMyNotes(page);
    if (!results) return;
    setNextPage(next);
    setNoteList([...noteList, ...results]);
    setIsLoading(false);
  };

  return (
    <MainContainer>
      <SubHeader title={t('notes.notes', { name: username || myProfile?.username })} />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} pv={14} w="100%" ph={DEFAULT_MARGIN}>
        {noteList.map((note) => (
          <NoteListItem note={note} key={note.id} />
        ))}
        <div ref={targetRef} />
        {isLoading && (
          <Layout.FlexRow w="100%" h={40}>
            <Loader />
          </Layout.FlexRow>
        )}
        {!isLoading && noteList.length < 1 && (
          <NoContents text={t('no_contents.all_notes')} mv={10} />
        )}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default AllNotes;
