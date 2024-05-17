import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '@components/_common/loader/Loader.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import ReceivedPromptList from '@components/notification/received-prompt-list/ReceivedPromptList';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { ResponseRequest } from '@models/api/question';
import { getReceivedPrompts } from '@utils/apis/my';

export default function ReceivedPrompts() {
  const [t] = useTranslation('translation', { keyPrefix: 'notifications' });
  const [receivedPrompts, setReceivedPrompts] = useState<ResponseRequest[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchReceivedPrompts(nextPage ?? null);
  });

  const fetchReceivedPrompts = async (page: string | null) => {
    const { results, next } = await getReceivedPrompts(page);
    if (!results) return;

    setNextPage(next);
    setReceivedPrompts((prev) => {
      return [...prev, ...results];
    });
    setIsLoading(false);
  };

  const recentPrompts = receivedPrompts.filter((n) => n.is_recent);
  const restPrompts = receivedPrompts.filter((n) => !n.is_recent);

  return (
    <MainContainer>
      <SubHeader title="Received Prompts" />
      <Layout.FlexCol mt={TITLE_HEADER_HEIGHT} w="100%" ph={16}>
        <ReceivedPromptList title={t('last_7_days')} prompts={recentPrompts} />
        <ReceivedPromptList title={t('last_30_days')} prompts={restPrompts} />
      </Layout.FlexCol>
      <div ref={targetRef} />
      {isLoading && (
        <Layout.FlexRow w="100%" h={40}>
          <Loader />
        </Layout.FlexRow>
      )}
    </MainContainer>
  );
}
