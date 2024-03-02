import { useParams } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';

function NoteDetail() {
  const { noteId } = useParams();

  return (
    <MainContainer>
      {/* TBU */}
      {noteId}
    </MainContainer>
  );
}

export default NoteDetail;
