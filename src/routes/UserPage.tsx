import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useOutlet, useParams } from 'react-router-dom';
import CommonError from '@components/_common/common-error/CommonError';
import { Divider } from '@components/_common/divider/Divider.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import UserHeader from '@components/header/user-header/UserHeader';
import NoteSection from '@components/note/note-section/NoteSection';
import Profile from '@components/profile/Profile';
import ResponseSection from '@components/response/response-section/ResponseSection';
import UserMoreModal from '@components/user-page/UserMoreModal';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { useBoundStore } from '@stores/useBoundStore';
import { readFriendCheckIn } from '@utils/apis/checkIn';

function UserPage() {
  const { username } = useParams();
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const isMyPage = username === myProfile?.username;
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  const { user, updateUser } = useContext(UserPageContext);
  const userId = user.data?.id;

  const readCheckIn = async () => {
    if (!username || !user.data || !user.data.check_in.id) return;
    await readFriendCheckIn(user.data.check_in.id);
  };

  useAsyncEffect(readCheckIn, [user.data]);

  useEffect(() => {
    if (!isMyPage) return;
    return navigate('/my');
  }, [isMyPage, navigate]);

  const handleClickMore = () => {
    setShowMore(true);
  };

  const outlet = useOutlet();

  return (
    <>
      <MainContainer key={username} style={{ display: outlet ? 'none' : 'block' }}>
        <UserHeader username={username} onClickMore={handleClickMore} userId={userId} />
        <Layout.FlexCol w="100%" bgColor="LIGHT" mt={TITLE_HEADER_HEIGHT}>
          {user.state === 'hasError' && <CommonError />}
          {user.state === 'hasValue' && user.data && (
            <UserMoreModal
              isVisible={showMore}
              setIsVisible={setShowMore}
              user={user.data}
              callback={updateUser}
            />
          )}
          {user.state !== 'hasError' && (
            <>
              {/** profile section */}
              <Layout.FlexRow
                w="100%"
                alignItems="center"
                justifyContent="space-between"
                p={12}
                bgColor="WHITE"
                rounded={8}
              >
                <Profile user={user.data} />
              </Layout.FlexRow>
              {/** responses and notes section */}
              <Divider width={8} bgColor="LIGHT" />
              <Layout.FlexCol pv={12} pl={12} w="100%" bgColor="WHITE" rounded={8}>
                <ResponseSection username={username} />
              </Layout.FlexCol>
              <Divider width={8} bgColor="LIGHT" />
              <Layout.FlexCol pt={12} pl={12} pb="default" w="100%" bgColor="WHITE" rounded={8}>
                <NoteSection username={username} />
              </Layout.FlexCol>
            </>
          )}
        </Layout.FlexCol>
      </MainContainer>
      <Outlet />
    </>
  );
}

export default UserPage;
