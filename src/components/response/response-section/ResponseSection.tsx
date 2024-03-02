import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { GetResponsesResponse } from '@models/api/response';
import { useBoundStore } from '@stores/useBoundStore';
import { getResponses } from '@utils/apis/responses';
import ResponseItem from '../response-item/ResponseItem';

function ResponseSection() {
  const myProfile = useBoundStore((state) => state.myProfile);
  const [responses, setResponses] = useState<FetchState<GetResponsesResponse>>({
    state: 'loading',
  });
  const [t] = useTranslation('translation', { keyPrefix: 'no_contents' });

  useAsyncEffect(async () => {
    getResponses()
      .then((data) => {
        setResponses({ state: 'hasValue', data });
      })
      .catch(() => {
        setResponses({ state: 'hasError' });
      });
  }, []);

  if (!myProfile) return null;
  return (
    <>
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
        <Typo type="title-large" color="BLACK">
          Responses
        </Typo>
      </Layout.FlexRow>
      <Layout.FlexCol w="100%" pr={12}>
        <Layout.FlexRow h="100%" mt={12}>
          {responses.state === 'loading' ? (
            <Loader />
          ) : responses.state === 'hasError' ? (
            <NoContents text={t('response_detail')} />
          ) : (
            <Layout.FlexCol w="100%" gap={8}>
              {responses.data.map((response) => (
                <ResponseItem key={response.id} response={response} />
              ))}
            </Layout.FlexCol>
          )}
        </Layout.FlexRow>
      </Layout.FlexCol>
    </>
  );
}

export default ResponseSection;
