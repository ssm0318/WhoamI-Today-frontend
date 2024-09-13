import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CommonError from '@components/_common/common-error/CommonError';
import Icon from '@components/_common/icon/Icon';
import NoContents from '@components/_common/no-contents/NoContents';
import SelectPromptSheet from '@components/prompt/select-prompt-sheet/SelectPromptSheet';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState, PaginationResponse } from '@models/api/common';
import { Response } from '@models/post';
import { getMyResponses } from '@utils/apis/my';
import { getUserResponses } from '@utils/apis/user';
import MoreResponseButton from '../more-response-button/MoreResponseButton';
import ResponseItem from '../response-item/ResponseItem';
import ResponseLoader from '../response-loader/ResponseLoader';
import * as S from './ResponseSection.styled';

type ResponseSectionProps = {
  /** username이 있으면 username에 대한 response를, 없으면 내 response를 보여줍니다. */
  username?: string;
};

const RESPONSE_VIEW_MAX_COUNT = 10;

function ResponseSection({ username }: ResponseSectionProps) {
  const [totalResponseCount, setTotalResponseCount] = useState(0);
  const [responses, setResponses] = useState<FetchState<PaginationResponse<Response[]>>>({
    state: 'loading',
  });
  const [t] = useTranslation('translation');
  const navigate = useNavigate();
  const [selectPrompt, setSelectPrompt] = useState(false);

  const fetchResponses = useCallback(async () => {
    try {
      const data = username ? await getUserResponses(username) : await getMyResponses(null);
      setResponses({ state: 'hasValue', data });
      setTotalResponseCount(data.count);
    } catch (error) {
      setResponses({ state: 'hasError' });
    }
  }, [username]);

  const isMoreButtonVisible = totalResponseCount > RESPONSE_VIEW_MAX_COUNT;

  const handleClickMore = () => {
    navigate(username ? `/users/${username}/responses` : '/my/responses');
  };

  useAsyncEffect(fetchResponses, [fetchResponses]);

  return (
    <>
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
        <Typo type="title-large" color="BLACK">
          {t('responses.title')}
        </Typo>
        {isMoreButtonVisible && <Icon onClick={handleClickMore} name="arrow_right" />}
      </Layout.FlexRow>
      <S.ResponseSectionWrapper w="100%" pr={12}>
        {responses.state === 'hasError' ? (
          <CommonError />
        ) : (
          <Layout.FlexRow
            h="100%"
            mt={12}
            w={responses?.data?.results?.length === 0 ? '100%' : undefined}
          >
            <Layout.FlexRow w="100%" gap={8} h="100%">
              {!username && (
                <Layout.FlexCol
                  gap={8}
                  w={100}
                  p={12}
                  h="100%"
                  alignItems="center"
                  justifyContent="center"
                  onClick={() => setSelectPrompt(true)}
                >
                  <Icon name="new_add" size={44} />
                  <Typo type="button-small" color="DARK_GRAY" textAlign="center">
                    {t('responses.new_response')}
                  </Typo>
                </Layout.FlexCol>
              )}
              {responses.state === 'loading' && (
                <>
                  <ResponseLoader />
                  <ResponseLoader />
                </>
              )}
              {responses.state === 'hasValue' && !responses.data.results?.length ? (
                <Layout.FlexRow alignItems="center" h="100%" justifyContent="center" w="100%">
                  <NoContents text={t('no_contents.responses')} pv={20} />
                </Layout.FlexRow>
              ) : (
                responses.data?.results
                  ?.slice(0, RESPONSE_VIEW_MAX_COUNT)
                  .map((response) => (
                    <ResponseItem
                      key={response.id}
                      response={response}
                      isMyPage={!username}
                      refresh={fetchResponses}
                    />
                  ))
              )}
            </Layout.FlexRow>
            {isMoreButtonVisible && <MoreResponseButton username={username} />}
          </Layout.FlexRow>
        )}
      </S.ResponseSectionWrapper>

      {selectPrompt && (
        <SelectPromptSheet visible={selectPrompt} closeBottomSheet={() => setSelectPrompt(false)} />
      )}
    </>
  );
}

export default ResponseSection;
