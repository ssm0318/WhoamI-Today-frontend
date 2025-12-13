/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import FilterChip from '@components/_common/filter-chip/FilterChip';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import RecentPost from '@components/_common/recent-post/RecentPost';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import { Layout } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { DiscoverFilter, DiscoverFilterLabel } from '@models/discover';
import { Note, POST_TYPE, Response } from '@models/post';
import { getMe } from '@utils/apis/my';
import { MainScrollContainer } from 'src/routes/Root';

const ScrollableFilterRow = styled(Layout.FlexRow)`
  overflow-x: auto;
  flex-wrap: nowrap;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

function Discover() {
  const [selectedFilter, setSelectedFilter] = useState<DiscoverFilter[]>([]);
  const discoverFilterList = [
    DiscoverFilter.follow,
    DiscoverFilter.MUTUAL_FRIENDS,
    DiscoverFilter.MUTUAL_TRAITS,
  ];
  const { scrollRef } = useRestoreScrollPosition('discoverPage');

  const handleRefresh = useCallback(async () => {
    // TODO: Implement refresh logic
    await Promise.all([getMe()]);
  }, []);

  const renderPostComponent = useCallback((post: Note | Response) => {
    switch (post.type) {
      case POST_TYPE.NOTE:
        return <RecentPost recentPost={post} hideContent />;
      //   case POST_TYPE.RESPONSE:
      //     return <ResponseItem response={response} displayType="LIST" isMyPage={false} />;
      default:
        return null;
    }
  }, []);

  return (
    <MainScrollContainer scrollRef={scrollRef} showNotificationPermission>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%" pb={FLOATING_BUTTON_SIZE + 20}>
          <ScrollableFilterRow gap={8} ph={16} pv={12}>
            {discoverFilterList.map((filter) => (
              <FilterChip
                key={filter}
                label={DiscoverFilterLabel[filter]}
                isSelected={selectedFilter.includes(filter)}
                onClick={() => setSelectedFilter([...selectedFilter, filter])}
              />
            ))}
          </ScrollableFilterRow>

          {/* POSTS -> Recent Posts */}

          {/* SELECT YOUR PERSONA */}
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default Discover;
