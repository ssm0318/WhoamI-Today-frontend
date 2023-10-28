import { useParams } from 'react-router-dom';
import MainContainer from '@components/_common/main-container/MainContainer';

export function FriendGroup() {
  const { id } = useParams();

  return <MainContainer>{id}</MainContainer>;
}

export default FriendGroup;
