import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useOutlet, useParams } from 'react-router-dom';
import { mutate } from 'swr';
import CommonError from '@components/_common/common-error/CommonError';
import { Divider } from '@components/_common/divider/Divider.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import UserHeader from '@components/header/user-header/UserHeader';
import NoteSection from '@components/note/note-section/NoteSection';
import Profile from '@components/profile/Profile';
import ResponseSection from '@components/response/response-section/ResponseSection';
import UserMoreModal from '@components/user-page/UserMoreModal';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { BOTTOM_TABBAR_HEIGHT, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { MAIN_SCROLL_CONTAINER_ID } from '@constants/scroll';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { readFriendCheckIn } from '@utils/apis/checkIn';

function UserPage() {
  const { username } = useParams();
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const isMyPage = username === myProfile?.username;
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const { featureFlags } = useBoundStore(UserSelector);

  const { user, updateUser } = useContext(UserPageContext);
  const userId = user.data?.id;
  const unreadCount = user.data?.unread_ping_count;

  const readCheckIn = async () => {
    if (!username || !user.data || !user.data.check_in.id) return;
    await readFriendCheckIn(user.data.check_in.id);
  };

  useAsyncEffect(readCheckIn, [user.data]);

  const outlet = useOutlet();

  useEffect(() => {
    if (isMyPage) {
      navigate('/my');
    }
  }, [isMyPage, navigate]);

  const handleClickMore = () => {
    setShowMore(true);
  };

  const handleRefresh = async () => {
    if (!username) return;

    const encodedUsername = encodeURIComponent(username);

    await Promise.all([
      mutate(`/user/${encodedUsername}/responses/`),
      mutate(`/user/${encodedUsername}/notes/`),
    ]);
  };

  return (
    <>
      <MainContainer
        key={username}
        style={{ height: '100vh', overflow: 'hidden', display: outlet ? 'none' : 'block' }}
      >
        <UserHeader
          username={username}
          onClickMore={handleClickMore}
          userId={userId}
          unreadCount={unreadCount}
        />
        <div
          id={MAIN_SCROLL_CONTAINER_ID}
          style={{
            height: `calc(100vh - ${TITLE_HEADER_HEIGHT}px - ${BOTTOM_TABBAR_HEIGHT}px)`,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            width: '100%',
            marginTop: `${TITLE_HEADER_HEIGHT}px`,
            paddingBottom: '24px', // 하단 여유 공간 추가
            position: 'relative',
          }}
        >
          <PullToRefresh onRefresh={handleRefresh}>
            <Layout.FlexCol w="100%" bgColor="LIGHT">
              {user.state === 'hasError' && <CommonError />}
              {user.state === 'hasValue' && user.data && (
                <UserMoreModal
                  isVisible={showMore}
                  setIsVisible={setShowMore}
                  user={user.data}
                  callback={updateUser}
                />
              )}
              {(user.state === 'loading' || user.state === 'hasValue') && (
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
                  {featureFlags?.friendList && (
                    <>
                      {/** responses and notes section */}
                      <Divider width={8} bgColor="LIGHT" />
                      <Layout.FlexCol pv={12} pl={12} w="100%" bgColor="WHITE" rounded={8}>
                        <ResponseSection username={username} />
                      </Layout.FlexCol>
                    </>
                  )}

                  <Divider width={8} bgColor="LIGHT" />
                  <Layout.FlexCol pt={8} pl={12} pb="default" w="100%" bgColor="WHITE" rounded={8}>
                    <NoteSection username={username} />
                  </Layout.FlexCol>
                </>
              )}
            </Layout.FlexCol>
          </PullToRefresh>
        </div>
      </MainContainer>
      <Outlet />
    </>
  );
}

export default UserPage;
