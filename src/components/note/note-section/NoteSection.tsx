import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import NoContents from '@components/_common/no-contents/NoContents';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { Note } from '@models/note';
import { useBoundStore } from '@stores/useBoundStore';
import { getMyNotes } from '@utils/apis/my';
import NewNoteButton from '../new-note-button/NewNoteButton';
import NoteItem from '../note-item/NoteItem';
import * as S from './NoteSection.styled';

function NoteSection() {
  const { username } = useParams();
  const [t] = useTranslation('translation');

  const myProfile = useBoundStore((state) => state.myProfile);
  const [noteList, setNoteList] = useState<Note[]>([]);

  // username이 없거나 myProfile의 username과 같다면 내 페이지
  const isMyPage = !username || username === myProfile?.username;

  const navigate = useNavigate();

  const handleClickMore = () => {
    navigate(`/notes`);
  };

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
        <Icon onClick={handleClickMore} name="arrow_right" />
      </Layout.FlexRow>
      <S.NoteSectionWrapper w="100%" pr={12} h={220}>
        <Layout.FlexRow gap={16} mt={10} h="100%">
          <Layout.FlexRow alignItems="center" h="100%">
            {isMyPage && <NewNoteButton />}
          </Layout.FlexRow>
          {noteList.length === 0 ? (
            <Layout.FlexRow alignItems="center" h="100%">
              <NoContents title={t('no_contents.notes')} />
            </Layout.FlexRow>
          ) : (
            noteList.map((note) => <NoteItem key={note.id} note={note} />)
          )}
        </Layout.FlexRow>
      </S.NoteSectionWrapper>
    </>
  );
}

export default NoteSection;
