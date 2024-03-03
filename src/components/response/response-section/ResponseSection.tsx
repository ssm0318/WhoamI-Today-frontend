import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NoContents from '@components/_common/no-contents/NoContents';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getMyResponses } from '@utils/apis/my';
import ResponseItem from '../response-item/ResponseItem';

// TODO: infinite scroll
function ResponseSection() {
  const myProfile = useBoundStore((state) => state.myProfile);
  const [responses, setResponses] = useState<Response[]>([]);
  const [t] = useTranslation('translation');

  const fetchResponses = useCallback(async () => {
    const { results } = await getMyResponses(null);
    if (!results) return;
    setResponses(results);
  }, []);

  useAsyncEffect(fetchResponses, [fetchResponses]);

  if (!myProfile) return null;
  return (
    <>
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
        <Typo type="title-large" color="BLACK">
          {t('responses.title')}
        </Typo>
      </Layout.FlexRow>
      <Layout.FlexCol w="100%" pr={12} alignItems="center">
        <Layout.FlexRow h="100%" mt={12}>
          <Layout.FlexCol w="100%" gap={8}>
            {responses.length === 0 ? (
              <Layout.FlexRow alignItems="center" h="100%" justifyContent="center" w="100%">
                <NoContents text={t('no_contents.responses')} />
              </Layout.FlexRow>
            ) : (
              responses.map((response) => <ResponseItem key={response.id} response={response} />)
            )}
          </Layout.FlexCol>
        </Layout.FlexRow>
      </Layout.FlexCol>
    </>
  );
}

export default ResponseSection;
