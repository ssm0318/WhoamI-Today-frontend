import { useNavigate, useParams } from 'react-router-dom';
import IconButton from '@components/_common/icon-button/IconButton';
import { Font, Layout } from '@design-system';
import { Note } from '@models/note';
import { useBoundStore } from '@stores/useBoundStore';
import NewNoteButton from '../new-note-button/NewNoteButton';
import NoteItem from '../note-item/NoteItem';

const noteList: Note[] = [
  {
    id: 1,
    content:
      'Lorem ipsum dolor sit amet consectetur. Leo mauris consectetur morbi mauris pellentesque. Posuere eget nulla pretium amet interdum suspendisse ve... more',
    created_at: '2021-09-01T00:00:00.000Z',
    current_user_like_id: null,
  },
  {
    id: 2,
    content: 'Lorem ipsum dolor sit amet consectetur. Diam mauris eget vitae ultrices amet.',
    created_at: '2021-09-01T00:00:00.000Z',
    current_user_like_id: null,
  },
  {
    id: 3,
    content: 'Lorem ipsum dolor',
    created_at: '2021-09-01T00:00:00.000Z',
    current_user_like_id: null,
  },
];

function NoteSection() {
  const { username } = useParams();

  const myProfile = useBoundStore((state) => state.myProfile);

  // username이 없거나 myProfile의 username과 같다면 내 페이지
  const isMyPage = !username || username === myProfile?.username;

  const navigate = useNavigate();
  if (!myProfile) return null;

  const handleClickMore = () => {
    navigate(`/notes`);
  };

  return (
    <>
      <Layout.FlexRow w="100%" justifyContent="space-between">
        <Font.Body type="20_semibold" color="BLACK">
          Notes
        </Font.Body>
        <IconButton onClick={handleClickMore} name="arrow_right" />
      </Layout.FlexRow>
      <Layout.FlexCol
        w="100%"
        style={{
          overflowX: 'scroll',
          whiteSpace: 'nowrap',
        }}
      >
        <Layout.FlexRow gap={16} mt={10}>
          {isMyPage && <NewNoteButton />}
          {noteList.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </Layout.FlexRow>
      </Layout.FlexCol>
    </>
  );
}

export const NOTE_WIDTH = 228;

export default NoteSection;
