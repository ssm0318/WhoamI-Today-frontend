import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Divider } from '@components/_common/divider/Divider.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import UserHeader from '@components/header/user-header/UserHeader';
import ReactionSection from '@components/reaction/reaction-section/ReactionSection';
import Status from '@components/status/Status';
import UserMoreModal from '@components/user-page/UserMoreModal';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { UserProfile } from '@models/user';
import { getUserProfile } from '@utils/apis/user';

function FriendPage() {
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

  if (!user.data) return null;

  return (
    <MainContainer>
      <UserHeader user={user.data} />
      <Layout.FlexCol w="100%" bgColor="BASIC_WHITE" mt={TITLE_HEADER_HEIGHT}>
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
        >
          <Status />
        </Layout.FlexRow>
        <ReactionSection emojis={['💪🏻', '😊', '😋']} />
        <Divider width={500} />
        <ReactionSection emojis={['💡', '🙇‍♀️', '🤾', '🤪', '🤯', '🥺']} />
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default FriendPage;
