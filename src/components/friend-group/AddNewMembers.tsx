import { useParams } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';
import TitleHeader from '@components/title-header/TitleHeader';

function AddNewMembers() {
  const { id } = useParams();

  return (
    <MainContainer>
      <TitleHeader
        // FIXME: 실제 그룹 이름
        title={id}
      />
    </MainContainer>
  );
}

export default AddNewMembers;
