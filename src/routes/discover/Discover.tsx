import { useCallback, useState } from 'react';
import FilterChip from '@components/_common/filter-chip/FilterChip';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import RecentPost from '@components/_common/recent-post/RecentPost';
import HighlightSection from '@components/discover/HighlightSection/HighlightSection';
import SelectInterestSection from '@components/discover/SelectInterestSection/SelectInterestSection';
import SelectPersonaSection from '@components/discover/SelectPersonaSection/SelectPersonaSection';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import { Layout } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { discoverPostList } from '@mock/discovers';
import { DiscoverFilter, DiscoverFilterLabel } from '@models/discover';
import { Highlight, Note, POST_TYPE, Response, SelectInterest, SelectPersona } from '@models/post';
import { getMe } from '@utils/apis/my';
import { MainScrollContainer } from 'src/routes/Root';
import * as S from './Discover.styled';

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

  const renderPostComponent = useCallback(
    (post: Note | Response | SelectInterest | SelectPersona | Highlight) => {
      switch (post.type) {
        case POST_TYPE.NOTE:
          return <RecentPost recentPost={post} hideContent />;
        case POST_TYPE.RESPONSE:
          return null;
        case POST_TYPE.SELECT_INTEREST:
          return <SelectInterestSection isSaved />;
        case POST_TYPE.SELECT_PERSONA:
          return <SelectPersonaSection />;
        case POST_TYPE.HIGHLIGHT:
          return <HighlightSection />;
        default:
          return null;
      }
    },
    [],
  );

  return (
    <MainScrollContainer scrollRef={scrollRef} showNotificationPermission>
      <PullToRefresh onRefresh={handleRefresh}>
        <Layout.FlexCol w="100%" pb={FLOATING_BUTTON_SIZE + 20}>
          <S.ScrollableFilterRow gap={8} ph={16} pv={12}>
            {discoverFilterList.map((filter) => (
              <FilterChip
                key={filter}
                label={DiscoverFilterLabel[filter]}
                isSelected={selectedFilter.includes(filter)}
                onClick={() => setSelectedFilter([...selectedFilter, filter])}
              />
            ))}
          </S.ScrollableFilterRow>

          {/* POSTS -> Recent Posts */}
          <Layout.FlexCol ph={16} gap={20}>
            {discoverPostList.map((post) => renderPostComponent(post))}
          </Layout.FlexCol>

          {/* SELECT YOUR PERSONA */}
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default Discover;
