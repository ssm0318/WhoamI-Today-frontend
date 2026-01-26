import { useTranslation } from 'react-i18next';
import { Layout, Typo } from '@design-system';

import { useBoundStore } from '@stores/useBoundStore';
import { SocialMetricsSectionWrapper } from './SocialMetricsSection.styled';

function SocialMetricsSection() {
  const { follower_count, following_count, friend_count } = useBoundStore((state) => ({
    follower_count: state.myProfile?.follower_count,
    following_count: state.myProfile?.following_count,
    friend_count: state.myProfile?.friend_count,
  }));

  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });

  const handleClickFollowing = () => {
    // TODO: FriendsTab의 following 탭으로 이동
  };

  const handleClickFollowers = () => {
    // TODO: followers 페이지로 이동
  };

  const handleClickFriends = () => {
    // TODO: FriendsTab의 friends 탭으로 이동
  };

  return (
    <SocialMetricsSectionWrapper w="100%" p={12} rounded={12} gap={8}>
      <Layout.FlexRow
        w="100%"
        gap={8}
        bgColor="WHITE"
        alignItems="flex-start"
        outline="GRAY_1"
        ph={12}
        pv={8}
        rounded={12}
      >
        <Layout.FlexCol
          alignItems="flex-start"
          gap={4}
          onClick={handleClickFollowing}
          style={{ cursor: 'pointer', flex: 1 }}
        >
          <Typo type="body-medium" bold mb={4}>
            {t('following')}
          </Typo>
          <Typo type="title-medium" color="BLACK">
            {following_count}
          </Typo>
        </Layout.FlexCol>
        <Layout.FlexCol
          alignItems="flex-start"
          gap={4}
          onClick={handleClickFollowers}
          style={{ cursor: 'pointer', flex: 1 }}
        >
          <Typo type="body-medium" bold mb={4}>
            {t('followers')}
          </Typo>
          <Typo type="title-medium" color="BLACK">
            {follower_count}
          </Typo>
        </Layout.FlexCol>
        <Layout.FlexCol
          alignItems="flex-start"
          gap={4}
          onClick={handleClickFriends}
          style={{ cursor: 'pointer', flex: 1 }}
        >
          <Typo type="body-medium" bold mb={4}>
            {t('friends')}
          </Typo>
          <Typo type="title-medium" color="BLACK">
            {friend_count}
          </Typo>
        </Layout.FlexCol>
      </Layout.FlexRow>
      <Typo type="label-medium" color="MEDIUM_GRAY">
        Only you can see this section
      </Typo>
    </SocialMetricsSectionWrapper>
  );
}

export default SocialMetricsSection;
