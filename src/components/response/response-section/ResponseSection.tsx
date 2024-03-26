import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import NoContents from '@components/_common/no-contents/NoContents';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getMyResponses } from '@utils/apis/my';
import MoreResponseButton from '../more-response-button/MoreResponseButton';
import ResponseItem from '../response-item/ResponseItem';
import * as S from './ResponseSection.styled';

type ResponseSectionProps = {
  isMyPage: boolean;
  username?: string;
};

function ResponseSection({ isMyPage, username }: ResponseSectionProps) {
  const myProfile = useBoundStore((state) => state.myProfile);
  const [responses, setResponses] = useState<Response[]>([]);
  const [t] = useTranslation('translation');
  const navigate = useNavigate();

  const fetchResponses = useCallback(async () => {
    const { results } = await getMyResponses(null);
    if (!results) return;
    setResponses(results);
  }, []);

  const handleClickMore = () => {
    navigate(isMyPage ? '/my/responses' : `/users/${username}/responses`);
  };

  useAsyncEffect(fetchResponses, [fetchResponses]);

  if (!myProfile) return null;
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
          <Layout.FlexRow w="100%" gap={8}>
            {responses.length === 0 ? (
              <Layout.FlexRow alignItems="center" h="100%" justifyContent="center" w="100%">
                <NoContents text={t('no_contents.responses')} />
              </Layout.FlexRow>
            ) : (
              responses.map((response) => (
                <ResponseItem key={response.id} response={response} isMyPage={isMyPage} />
              ))
            )}
          </Layout.FlexRow>
          <MoreResponseButton isMyPage={isMyPage} />
        </Layout.FlexRow>
      </S.ResponseSectionWrapper>
    </>
  );
}

export default ResponseSection;
