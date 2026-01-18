import { useTranslation } from 'react-i18next';
import { Layout, Typo } from '@design-system';

import { SocialMetricsSectionWrapper } from './SocialMetricsSection.styled';

interface SocialMetricsSectionProps {
  followingCount?: number;
  followersCount?: number;
  friendsCount?: number;
}

function SocialMetricsSection({
  followingCount = 0,
  followersCount = 0,
  friendsCount = 0,
}: SocialMetricsSectionProps) {
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
            Following
          </Typo>
          <Typo type="title-medium" color="BLACK">
            {followingCount}
          </Typo>
        </Layout.FlexCol>
        <Layout.FlexCol
          alignItems="flex-start"
          gap={4}
          onClick={handleClickFollowers}
          style={{ cursor: 'pointer', flex: 1 }}
        >
          <Typo type="body-medium" bold mb={4}>
            Followers
          </Typo>
          <Typo type="title-medium" color="BLACK">
            {followersCount}
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
            {friendsCount}
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
