import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NoContents from '@components/_common/no-contents/NoContents';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { Note } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getMyNotes } from '@utils/apis/my';
import NoteItem from '../note-item/NoteItem';

type NoteSectionProps = {
  isMyPage: boolean;
};

function NoteSection({ isMyPage }: NoteSectionProps) {
  const [t] = useTranslation('translation');

  const myProfile = useBoundStore((state) => state.myProfile);
  const [noteList, setNoteList] = useState<Note[]>([]);

  const fetchNotes = useCallback(async () => {
    const { results } = await getMyNotes(null);
    if (!results) return;
    setNoteList(results);
  }, []);

  useAsyncEffect(fetchNotes, [fetchNotes]);

  if (!myProfile) return null;
  return (
    <>
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
        <Typo type="title-large" color="BLACK">
          {t('notes.title')}
        </Typo>
      </Layout.FlexRow>
      <Layout.FlexCol w="100%" pr={12}>
        <Layout.FlexCol gap={16} mt={10} h="100%">
          {noteList.length === 0 ? (
            <Layout.FlexRow alignItems="center" h="100%">
              <NoContents title={t('no_contents.notes')} />
            </Layout.FlexRow>
          ) : (
            noteList.map((note) => <NoteItem key={note.id} note={note} isMyPage={isMyPage} />)
          )}
        </Layout.FlexCol>
      </Layout.FlexCol>
    </>
  );
}

export default NoteSection;
