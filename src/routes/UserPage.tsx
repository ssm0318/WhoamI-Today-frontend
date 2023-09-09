import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import CommonError from '@components/_common/common-error/CommonError';
import { Divider } from '@components/_common/divider/Divider.styled';
import { Loader } from '@components/_common/loader/Loader.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import NoContents from '@components/_common/no-contents/NoContents';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import TheDaysDetail from '@components/the-days-detail/TheDaysDetail';
import TitleHeader from '@components/title-header/TitleHeader';
import FriendStatusButton from '@components/user-page/FriendStatusButton';
import UserMoreModal from '@components/user-page/UserMoreModal';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { GetFriendsTodayResponse } from '@models/api/friends';
import { UserProfile } from '@models/user';
import { getFriendToday } from '@utils/apis/friends';
import { getUserProfile } from '@utils/apis/user';

function UserPage() {
  const [t] = useTranslation('translation');

  const { username } = useParams();

  const [user, setUser] = useState<FetchState<UserProfile>>({ state: 'loading' });
  const [userToday, setUserToday] = useState<FetchState<GetFriendsTodayResponse>>({
    state: 'loading',
  });

  const [showMore, setShowMore] = useState(false);

  const updateUser = async () => {
    if (!username) return;

    try {
      const res = await getUserProfile(username);
      setUser({ state: 'hasValue', data: res });
    } catch (error) {
      setUser({ state: 'hasError' });
    }
  };

  useAsyncEffect(updateUser, []);

  useAsyncEffect(async () => {
    if (user.state !== 'hasValue') return;
    if (!user.data.are_friends) return;

    // TODO: 로그인한 사용자의 페이지 대응
    getFriendToday(user.data.id)
      .then((data) => {
        setUserToday({ state: 'hasValue', data });
      })
      .catch(() => setUserToday({ state: 'hasError' }));
  }, [user]);

  const handleOnClickMore = () => {
    setShowMore(true);
  };

  return (
    <MainContainer>
      <TitleHeader
        title={username}
        RightComponent={
          <button type="button" onClick={handleOnClickMore}>
            {/* TODO: ... 아이콘으로 업데이트 필요 */}
            <SvgIcon name="top_navigation_hamburger" size={36} />
          </button>
        }
      />
      {user.state === 'hasValue' && (
        <UserMoreModal
          isVisible={showMore}
          setIsVisible={setShowMore}
          user={user.data}
          callback={updateUser}
        />
      )}
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT + 14} w="100%" ph={18}>
        {user.state === 'hasValue' ? (
          <>
            <ProfileImage
              imageUrl={user.data.profile_image}
              username={user.data.username}
              size={100}
            />
            <Layout.FlexRow ml={10} mb={12}>
              <Font.Body type="20_semibold" mr={18}>
                {user.data.username}
              </Font.Body>
              <FriendStatusButton user={user.data} callback={updateUser} />
            </Layout.FlexRow>
            <Divider width={1} />
            {userToday.state === 'loading' ? (
              <Loader />
            ) : userToday.state === 'hasError' ? (
              <CommonError />
            ) : userToday.data.length === 0 ? (
              <NoContents text={t('no_contents.the_day_detail')} />
            ) : (
              <TheDaysDetail
                moments={userToday.data[0].moments}
                questions={userToday.data[0].questions}
              />
            )}
          </>
        ) : user.state === 'hasError' ? (
          <Font.Body type="20_regular">{t('user_page.this_user_do_not_exist')}</Font.Body>
        ) : (
          <Loader />
        )}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default UserPage;
