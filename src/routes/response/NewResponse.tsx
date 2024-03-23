import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Loader } from '@components/_common/loader/Loader.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { StyledNewResponsePrompt } from '@components/_common/prompt/PromptCard.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { Question } from '@models/post';
import { getQuestionDetail } from '@utils/apis/question';
import { FlexRow, LayoutBase } from 'src/design-system/layouts';

const isValidQuestionId = (questionId?: string): questionId is string =>
  !!questionId && /^\d+$/.test(questionId);

function NewResponse() {
  const { questionId } = useParams();
  const [t] = useTranslation('translation', { keyPrefix: 'question.response' });
  const [question, setQuestion] = useState<FetchState<Question>>({ state: 'loading' });

  useAsyncEffect(async () => {
    if (!isValidQuestionId(questionId)) return;
    // TODO: 잘못된 접근 처리
    getQuestionDetail(questionId)
      .then((data) => {
        setQuestion({ state: 'hasValue', data });
      })
      .catch((error) => ({ state: 'hasError', error }));
  }, []);

  return (
    <MainContainer>
      <SubHeader title={t('new_response')} />
      <LayoutBase mt={TITLE_HEADER_HEIGHT} w="100%" pt={20} ph={12}>
        {question.state === 'loading' && <Loader />}
        {question.state === 'hasValue' && (
          <StyledNewResponsePrompt>
            <FlexRow gap={8} alignItems="center" mb={12}>
              <ProfileImage imageUrl="/whoami-profile.svg" username="Whoami Today" size={28} />
              <Typo type="title-medium">Whoami Today</Typo>
            </FlexRow>
            <Typo type="body-large">{question.data.content}</Typo>
          </StyledNewResponsePrompt>
        )}
      </LayoutBase>
    </MainContainer>
  );
}

export default NewResponse;
