import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '@components/_common/loader/Loader.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { FetchState } from '@models/api/common';
import { GetResponseDetailResponse } from '@models/api/response';
import { getResponse } from '@utils/apis/responses';
import ResponseDetail from './ResponseDetail';

function ResponseDetailContainer() {
  const { responseId } = useParams();
  const [responseState, setResponseState] = useState<FetchState<GetResponseDetailResponse>>({
    state: 'loading',
  });

  const getResponseDetail = useCallback(() => {
    if (!responseId) return;
    getResponse(responseId)
      .then((data) => {
        if (data) setResponseState({ state: 'hasValue', data });
        else setResponseState({ state: 'hasError' });
      })
      .catch(() => setResponseState({ state: 'hasError' }));
  }, [responseId]);
  useEffect(getResponseDetail, [getResponseDetail]);

  return (
    <MainContainer>
      <TitleHeader title="response" />
      <Layout.FlexCol w="100%" pv={28} ph={24} gap={14} mt={TITLE_HEADER_HEIGHT}>
        {/* TODO: not found page */}
        {responseState.state === 'hasError' ? (
          <>NotFound</>
        ) : (
          <>
            {responseState.state === 'loading' && <Loader />}
            {responseState.state === 'hasValue' && <ResponseDetail response={responseState.data} />}
          </>
        )}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default ResponseDetailContainer;
