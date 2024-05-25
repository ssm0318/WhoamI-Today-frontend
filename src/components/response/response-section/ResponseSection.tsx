import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import NoContents from '@components/_common/no-contents/NoContents';
import SelectPromptSheet from '@components/prompt/select-prompt-sheet/SelectPromptSheet';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { Response } from '@models/post';
import { getMyResponses } from '@utils/apis/my';
import { getUserResponses } from '@utils/apis/user';
import MoreResponseButton from '../more-response-button/MoreResponseButton';
import ResponseItem from '../response-item/ResponseItem';
import * as S from './ResponseSection.styled';

type ResponseSectionProps = {
  /** username이 있으면 username에 대한 response를, 없으면 내 response를 보여줍니다. */
  username?: string;
};

function ResponseSection({ username }: ResponseSectionProps) {
  const [responses, setResponses] = useState<Response[]>([]);
  const [t] = useTranslation('translation');
  const navigate = useNavigate();
  const [selectPrompt, setSelectPrompt] = useState(false);

  const fetchResponses = useCallback(async () => {
    const { results } = username ? await getUserResponses(username) : await getMyResponses(null);
    if (!results) return;
    setResponses(results);
  }, [username]);

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
        <Icon onClick={handleClickMore} name="arrow_right" />
      </Layout.FlexRow>
      <S.ResponseSectionWrapper w="100%" pr={12}>
        <Layout.FlexRow h="100%" mt={12}>
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
            {responses.length === 0 ? (
              <Layout.FlexRow alignItems="center" h="100%" justifyContent="center" w="100%">
                <NoContents text={t('no_contents.responses')} />
              </Layout.FlexRow>
            ) : (
              responses.map((response) => (
                <ResponseItem key={response.id} response={response} isMyPage={!username} />
              ))
            )}
          </Layout.FlexRow>
          <MoreResponseButton username={username} />
        </Layout.FlexRow>
      </S.ResponseSectionWrapper>
      {selectPrompt && (
        <SelectPromptSheet visible={selectPrompt} closeBottomSheet={() => setSelectPrompt(false)} />
      )}
    </>
  );
}

export default ResponseSection;
