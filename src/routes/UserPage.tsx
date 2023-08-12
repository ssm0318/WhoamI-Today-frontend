import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Divider } from '@components/_common/divider/Divider.styled';
import { Loader } from '@components/_common/loader/Loader.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import TitleHeader from '@components/title-header/TitleHeader';
import FriendStatusButton from '@components/user-page/FriendStatusButton';
import UserMoreModal from '@components/user-page/UserMoreModal';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { UserProfile } from '@models/user';
import { getUserProfile } from '@utils/apis/user';

function UserPage() {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });

  const { username } = useParams();
  const [user, setUser] = useState<FetchState<UserProfile>>({ state: 'loading' });

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
            {/* TODO: 오늘의 게시글 */}
          </>
        ) : user.state === 'hasError' ? (
          <Font.Body type="20_regular">{t('this_user_do_not_exist')}</Font.Body>
        ) : (
          <Loader />
        )}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default UserPage;
