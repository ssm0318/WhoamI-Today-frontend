import { useCallback, useState } from 'react';
import FilterChip from '@components/_common/filter-chip/FilterChip';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import HighlightSection from '@components/discover/HighlightSection/HighlightSection';
import SelectInterestSection from '@components/discover/SelectInterestSection/SelectInterestSection';
import SelectPersonaSection from '@components/discover/SelectPersonaSection/SelectPersonaSection';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import { Layout } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useSaveAndHide } from '@hooks/useSaveAndHide';
import { discoverPostList } from '@mock/discovers';
import { DiscoverFilter, DiscoverFilterLabel } from '@models/discover';
import { Highlight, Note, POST_TYPE, Response, SelectInterest, SelectPersona } from '@models/post';
import { getMe } from '@utils/apis/my';
import { MainScrollContainer } from 'src/routes/Root';
import * as S from './Discover.styled';

function Discover() {
  const [selectedFilter, setSelectedFilter] = useState<DiscoverFilter[]>([]);
  const {
    isSaved: isPersonaSaved,
    showCard: showPersonaCard,
    isAnimating: isPersonaAnimating,
    handleSave: handlePersonaSave,
  } = useSaveAndHide();

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

  // TODO: 실제 데이터 연결 시 props 다시 한번 체크 필요 (테스트용으로 들어가있는거 없는지)
  const renderPostComponent = useCallback(
    (post: Note | Response | SelectInterest | SelectPersona | Highlight) => {
      switch (post.type) {
        case POST_TYPE.NOTE:
          // TODO: discover용 PostItem 새로 만들자
          // return <RecentPostItem recentPost={post} showNewBadge={false} />;
          return null;
        case POST_TYPE.RESPONSE:
          return null;
        // TODO: SelectInterestSection에도 animation 로직 필요한지 확인 후 적용
        case POST_TYPE.SELECT_INTEREST:
          return <SelectInterestSection isSaved />;
        case POST_TYPE.SELECT_PERSONA:
          return showPersonaCard ? (
            <S.AnimatedCardWrapper $isAnimating={isPersonaAnimating}>
              <SelectPersonaSection isSaved={isPersonaSaved} onSave={handlePersonaSave} />
            </S.AnimatedCardWrapper>
          ) : null;
        case POST_TYPE.HIGHLIGHT:
          return <HighlightSection />;
        default:
          return null;
      }
    },
    [isPersonaSaved, showPersonaCard, handlePersonaSave, isPersonaAnimating],
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
                onClick={() => {
                  if (selectedFilter.includes(filter)) {
                    setSelectedFilter(selectedFilter.filter((f) => f !== filter));
                  } else {
                    setSelectedFilter([...selectedFilter, filter]);
                  }
                }}
              />
            ))}
          </S.ScrollableFilterRow>

          {/* POSTS -> Recent Posts */}
          <Layout.FlexCol gap={20} mh={16}>
            {discoverPostList.map((post) => renderPostComponent(post))}
          </Layout.FlexCol>

          {/* SELECT YOUR PERSONA */}
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default Discover;
