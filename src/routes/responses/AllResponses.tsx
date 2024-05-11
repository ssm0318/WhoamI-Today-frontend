import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import ResponseItem from '@components/response/response-item/ResponseItem';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getMyResponses } from '@utils/apis/my';
import { getUserResponses } from '@utils/apis/user';

type AllResponsesProps = {
  isMyPage?: boolean;
};

function AllResponses({ isMyPage = false }: AllResponsesProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'all_responses' });
  const [responses, setResponses] = useState<Response[]>([]);
  const [nextPage, setNextPage] = useState<string | null | undefined>(undefined);
  const { username } = useParams();
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  const getResponses = useCallback(
    async (page: string | null) => {
      if (isMyPage) return getMyResponses(page);
      return getUserResponses(username || '', page);
    },
    [isMyPage, username],
  );

  const { isLoading, targetRef, setIsLoading } = useInfiniteScroll<HTMLDivElement>(async () => {
    if (nextPage === null) return setIsLoading(false);
    await fetchResponses(nextPage ?? null);
  });

  const fetchResponses = async (page: string | null, isRefresh?: boolean) => {
    const { results, next } = await getResponses(page);
    if (!results) return;
    setNextPage(next);
    if (isRefresh) {
      setResponses(results);
    } else {
      setResponses([...responses, ...results]);
    }
    setIsLoading(false);
  };

  // Refetch responses
  const handleRefetch = async () => {
    await fetchResponses(null, true);
  };

  return (
    <MainContainer>
      <SubHeader title={t('title', { username: username || myProfile?.username })} />
      <Layout.FlexCol w="100%" mt={TITLE_HEADER_HEIGHT + 12} ph={16} gap={12}>
        {responses.map((response) => (
          <ResponseItem
            key={response.id}
            response={response}
            isMyPage={isMyPage}
            type="DETAIL"
            refresh={handleRefetch}
          />
        ))}
        <div ref={targetRef} />
        {isLoading && (
          <Layout.FlexRow w="100%" h={40}>
            <Loader />
          </Layout.FlexRow>
        )}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default AllResponses;
