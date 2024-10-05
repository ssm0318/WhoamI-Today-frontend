import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import { Layout, Typo } from '@design-system';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { Note } from '@models/post';
import NoteItem from '../note-item/NoteItem';
import NoteLoader from '../note-loader/NoteLoader';

type NoteSectionProps = {
  /** username이 있으면 username에 대한 response를, 없으면 내 response를 보여줍니다. */
  username?: string;
};

function NoteSection({ username }: NoteSectionProps) {
  const [t] = useTranslation('translation');

  const {
    targetRef,
    data: notes,
    isLoading: isNotesLoading,
    isLoadingMore: isNotesLoadingMore,
    mutate: refetchNotes,
  } = useSWRInfiniteScroll<Note>({
    key: `/user/${username || 'me'}/notes/`,
  });

  return (
    <>
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
        <Typo type="title-large" color="BLACK">
          {t('notes.title')}
        </Typo>
      </Layout.FlexRow>
      <Layout.FlexCol w="100%" pr={12}>
        <Layout.FlexCol gap={8} mt={10} w="100%" h="100%">
          {isNotesLoading ? (
            <NoteLoader />
          ) : notes?.[0] && notes[0].count > 0 ? (
            <>
              {notes.map(({ results }) =>
                results?.map((note) => (
                  <NoteItem key={note.id} note={note} isMyPage={!username} refresh={refetchNotes} />
                )),
              )}
              <div ref={targetRef} />
              {isNotesLoadingMore && (
                <Layout.FlexRow w="100%" h={40}>
                  <Loader />
                </Layout.FlexRow>
              )}
            </>
          ) : (
            <Layout.FlexRow alignItems="center" w="100%" h="100%">
              <NoContents title={t('no_contents.notes')} />
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
      </Layout.FlexCol>
    </>
  );
}

export default NoteSection;
