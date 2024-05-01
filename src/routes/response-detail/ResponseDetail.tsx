import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import CommentList from '@components/comment-list/CommentList';
import ResponseItem from '@components/response/response-item/ResponseItem';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { Response } from '@models/post';
import { getResponse } from '@utils/apis/responses';

function ResponseDetail() {
  const { responseId } = useParams();
  const [t] = useTranslation('translation');
  const [responseDetail, setResponseDetail] = useState<Response | null>(null);

  const getResponseDetail = useCallback(async () => {
    if (!responseId) return;
    setResponseDetail(await getResponse(Number(responseId)));
  }, [responseId]);

  useAsyncEffect(getResponseDetail, [getResponseDetail]);

  if (!responseDetail) return <Loader />;

  const { username } = responseDetail.author_detail;

  return (
    <MainContainer>
      <SubHeader
        title={t('response_detail.title', {
          name: username,
        })}
      />
      <Layout.FlexCol w="100%" mt={TITLE_HEADER_HEIGHT + 12} ph={16}>
        <ResponseItem response={responseDetail} type="DETAIL" />
      </Layout.FlexCol>
      <Layout.FlexCol w="100%" flex={1}>
        <CommentList postType="Response" post={responseDetail} />
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default ResponseDetail;
