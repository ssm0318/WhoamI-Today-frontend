import { isAxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import CommonError from '@components/_common/common-error/CommonError';
import Loader from '@components/_common/loader/Loader';
import MainContainer from '@components/_common/main-container/MainContainer';
import NoContents from '@components/_common/no-contents/NoContents';
import CommentList from '@components/comment-list/CommentList';
import ResponseItem from '@components/response/response-item/ResponseItem';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getResponse } from '@utils/apis/responses';

function ResponseDetail() {
  const { responseId } = useParams();

  const [t] = useTranslation('translation');

  const [responseDetail, setResponseDetail] = useState<FetchState<Response>>({ state: 'loading' });
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  const getResponseDetail = useCallback(async () => {
    if (!responseId) return;
    try {
      const data = await getResponse(Number(responseId));
      setResponseDetail({ state: 'hasValue', data });
    } catch (error) {
      if (isAxiosError(error)) {
        setResponseDetail({ state: 'hasError', error });
        return;
      }
      setResponseDetail({ state: 'hasError' });
    }
  }, [responseId]);

  useAsyncEffect(getResponseDetail, [getResponseDetail]);

  return (
    <MainContainer>
      {responseDetail.state === 'loading' && <Loader />}
      {responseDetail.state === 'hasValue' && (
        <>
          <SubHeader
            title={t('response_detail.title', {
              name: responseDetail.data?.author_detail.username,
            })}
          />
          <Layout.FlexCol w="100%" mt={TITLE_HEADER_HEIGHT + 12} ph={16}>
            <ResponseItem
              response={responseDetail.data}
              type="DETAIL"
              isMyPage={responseDetail.data.author_detail.id === myProfile?.id}
            />
          </Layout.FlexCol>
          <Layout.FlexCol w="100%" flex={1}>
            <CommentList postType="Response" post={responseDetail.data} />
          </Layout.FlexCol>
        </>
      )}
      {responseDetail.state === 'hasError' && (
        <>
          <SubHeader title={t('response_detail.error_title', { username: '' })} />
          <Layout.FlexCol w="100%" alignItems="center" mt={TITLE_HEADER_HEIGHT + 12} ph={16}>
            {!responseDetail.error || responseDetail.error.response?.status === 500 ? (
              <CommonError />
            ) : (
              <NoContents
                title={
                  responseDetail.error.response?.status === 403
                    ? t('no_contents.forbidden_post')
                    : t('no_contents.not_found_post')
                }
              />
            )}
          </Layout.FlexCol>
        </>
      )}
    </MainContainer>
  );
}

export default ResponseDetail;
