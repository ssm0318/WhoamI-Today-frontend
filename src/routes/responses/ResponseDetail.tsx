import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CommonError from '@components/_common/common-error/CommonError';
import NoContents from '@components/_common/no-contents/NoContents';
import CommentList from '@components/comment-list/CommentList';
import ResponseItem from '@components/response/response-item/ResponseItem';
import ResponseLoader from '@components/response/response-loader/ResponseLoader';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getResponse } from '@utils/apis/responses';
import { MainScrollContainer } from '../Root';

function ResponseDetail() {
  const { responseId } = useParams();

  const [t] = useTranslation('translation');
  const navigate = useNavigate();
  const location = useLocation();

  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const [responseDetail, setResponseDetail] = useState<FetchState<Response>>({ state: 'loading' });
  const [reload, setReload] = useState<boolean>(false);
  const [inputFocus, setInputFocus] = useState(false);

  useAsyncEffect(async () => {
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
  }, [responseId, reload]);

  const handleGoBack = () => {
    navigate('/my');
  };

  return (
    <MainScrollContainer>
      <SubHeader
        title={
          responseDetail.data
            ? t('response_detail.title', {
                name: responseDetail.data?.author_detail?.username,
              })
            : ''
        }
        onGoBack={location.state === 'new' ? handleGoBack : undefined}
      />
      <Layout.FlexCol w="100%" mt={12} ph={16}>
        {responseDetail.state === 'loading' && <ResponseLoader type="DETAIL" />}
        {responseDetail.state === 'hasValue' && (
          <ResponseItem
            response={responseDetail.data}
            displayType="DETAIL"
            isMyPage={responseDetail.data.author_detail?.id === myProfile?.id}
          />
        )}
      </Layout.FlexCol>
      {responseDetail.state === 'hasValue' && (
        <Layout.FlexCol w="100%" flex={1}>
          <CommentList
            postType="Response"
            post={responseDetail.data}
            setReload={setReload}
            inputFocus={inputFocus}
            setInputFocus={setInputFocus}
          />
        </Layout.FlexCol>
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
    </MainScrollContainer>
  );
}

export default ResponseDetail;
