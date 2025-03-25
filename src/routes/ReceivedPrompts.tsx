import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '@components/_common/loader/Loader.styled';
import ReceivedPromptList from '@components/notification/received-prompt-list/ReceivedPromptList';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { ResponseRequest } from '@models/api/question';
import { getResponseRequests } from '@utils/apis/my';
import { MainScrollContainer } from './Root';

export default function ReceivedPrompts() {
  const [t] = useTranslation('translation', { keyPrefix: 'notifications' });
  const [responseRequests, setResponseRequests] = useState<ResponseRequest[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchReceivedPrompts(nextPage ?? null);
  });

  const fetchReceivedPrompts = async (page: string | null) => {
    const { results, next } = await getResponseRequests(page);
    if (!results) return;

    setNextPage(next);
    setResponseRequests((prev) => {
      return [...prev, ...results];
    });
    setIsLoading(false);
  };

  const recentRequests = responseRequests.filter((n) => n.is_recent);
  const restRequests = responseRequests.filter((n) => !n.is_recent);
  const [currentDate] = useState(() => new Date());

  return (
    <MainScrollContainer>
      <SubHeader title="Received Questions" />
      <Layout.FlexCol w="100%" ph={16} pb={16}>
        <ReceivedPromptList
          title={t('last_7_days')}
          responseRequests={recentRequests}
          currDate={currentDate}
        />
        <ReceivedPromptList
          title={t('last_30_days')}
          responseRequests={restRequests}
          currDate={currentDate}
        />
      </Layout.FlexCol>
      <div ref={targetRef} />
      {isLoading && (
        <Layout.FlexRow w="100%" h={40}>
          <Loader />
        </Layout.FlexRow>
      )}
    </MainScrollContainer>
  );
}
