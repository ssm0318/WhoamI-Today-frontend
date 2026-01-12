import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterChip from '@components/_common/filter-chip/FilterChip';
import NoContents from '@components/_common/no-contents/NoContents';
import PromptCard from '@components/_common/prompt/PromptCard';
import PullToRefresh from '@components/_common/pull-to-refresh/PullToRefresh';
import SelectInterestSection from '@components/discover/SelectInterestSection/SelectInterestSection';
import SelectPersonaSection from '@components/discover/SelectPersonaSection/SelectPersonaSection';
import { FLOATING_BUTTON_SIZE } from '@components/header/floating-button/FloatingButton.styled';
import ResponseItem from '@components/response/response-item/ResponseItem';
import ResponseLoader from '@components/response/response-loader/ResponseLoader';
import { Layout } from '@design-system';
import { useRestoreScrollPosition } from '@hooks/useRestoreScrollPosition';
import { useSaveAndHide } from '@hooks/useSaveAndHide';
import { useSWRInfiniteScroll } from '@hooks/useSWRInfiniteScroll';
import { DiscoverFilter, DiscoverFilterLabel, DiscoverResultItem } from '@models/discover';
import { getDiscoverFeed } from '@utils/apis/discover';
import { getMe } from '@utils/apis/my';
import { PromptCardLoader } from 'src/routes/questions/AllQuestionsLoader';
import { MainScrollContainer } from 'src/routes/Root';
import * as S from './Discover.styled';

function Discover() {
  const [t] = useTranslation('translation');
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

  const {
    targetRef,
    data: discoverData,
    isLoadingMore,
    isLoading,
    mutate,
  } = useSWRInfiniteScroll<DiscoverResultItem>({ key: '/user/discover/' });

  const handleRefresh = useCallback(async () => {
    await Promise.all([getDiscoverFeed(null), getMe()]);
    mutate();
  }, [mutate]);

  const renderDiscoverItem = useCallback(
    (item: DiscoverResultItem, index: number) => {
      switch (item.type) {
        case 'Response':
          return <ResponseItem key={`response-${item.body.id}`} response={item.body} />;
        case 'Question':
          return (
            <PromptCard
              key={`question-${item.body.id}`}
              id={item.body.id}
              content={item.body.content}
              widthMode="full"
            />
          );
        case 'Interest':
          return (
            <SelectInterestSection
              key={`interest-${index}`}
              isSaved={item.body.list.every((interest) => interest.is_selected)}
            />
          );
        case 'Persona':
          return showPersonaCard ? (
            <S.AnimatedCardWrapper key={`persona-${index}`} $isAnimating={isPersonaAnimating}>
              <SelectPersonaSection isSaved={isPersonaSaved} onSave={handlePersonaSave} />
            </S.AnimatedCardWrapper>
          ) : null;
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

          {/* Discover Feed */}
          <Layout.FlexCol gap={20} mh={16}>
            {isLoading ? (
              <>
                <ResponseLoader />
                <PromptCardLoader />
                <ResponseLoader />
              </>
            ) : discoverData?.[0] &&
              discoverData[0].results &&
              discoverData[0].results.length > 0 ? (
              <>
                {discoverData.map((page) =>
                  page.results?.map((item, index) => renderDiscoverItem(item, index)),
                )}
                <div ref={targetRef} />
                {isLoadingMore && (
                  <>
                    <ResponseLoader />
                    <PromptCardLoader />
                  </>
                )}
              </>
            ) : (
              <NoContents text={t('no_contents.discover')} mv={10} />
            )}
          </Layout.FlexCol>
        </Layout.FlexCol>
      </PullToRefresh>
    </MainScrollContainer>
  );
}

export default Discover;
