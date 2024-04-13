import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Divider } from '@components/_common/divider/Divider.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import UserHeader from '@components/header/user-header/UserHeader';
import NoteSection from '@components/note/note-section/NoteSection';
import Profile from '@components/profile/Profile';
import ResponseSection from '@components/response/response-section/ResponseSection';
import UserMoreModal from '@components/user-page/UserMoreModal';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { readFriendCheckIn } from '@utils/apis/checkIn';
import { getUserProfile } from '@utils/apis/user';

function FriendPage() {
  const { username } = useParams();
  const [user, setUser] = useState<FetchState<UserProfile>>({ state: 'loading' });
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const isMyPage = username === myProfile?.username;
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  const updateUser = async () => {
    if (!username) return;

    try {
      const res = await getUserProfile(username);
      setUser({ state: 'hasValue', data: res });
    } catch (error) {
      setUser({ state: 'hasError' });
    }
  };

  const readCheckIn = async () => {
    if (!username || !user.data) return;
    await readFriendCheckIn(user.data.id);
  };

  useAsyncEffect(updateUser, []);

  useAsyncEffect(readCheckIn, [user.data]);

  useEffect(() => {
    if (!isMyPage) return;
    return navigate('/my');
  }, [isMyPage, navigate]);

  if (!username || !user.data) return null;
  return (
    <MainContainer>
      <UserHeader user={user.data} />
      <Layout.FlexCol w="100%" bgColor="LIGHT" mt={TITLE_HEADER_HEIGHT}>
        <UserMoreModal
          isVisible={showMore}
          setIsVisible={setShowMore}
          user={user.data}
          callback={updateUser}
        />
        <Layout.FlexRow
          w="100%"
          alignItems="center"
          justifyContent="space-between"
          ph={DEFAULT_MARGIN}
          pv={12}
          bgColor="WHITE"
          rounded={8}
        >
          <Profile user={user.data} />
        </Layout.FlexRow>
        <Divider width={8} bgColor="LIGHT" />
        <Layout.FlexCol pv={12} pl={12} w="100%" bgColor="WHITE" rounded={8}>
          <ResponseSection username={username} />
        </Layout.FlexCol>
        <Divider width={8} bgColor="LIGHT" />
        <Layout.FlexCol pt={12} pl={12} pb="default" w="100%" bgColor="WHITE" rounded={8}>
          <NoteSection username={username} />
        </Layout.FlexCol>
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default FriendPage;
