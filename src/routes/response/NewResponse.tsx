import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '@components/_common/loader/Loader.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { StyledNewResponsePrompt } from '@components/_common/prompt/PromptCard.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { TextArea, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { Question } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getQuestionDetail, responseQuestion } from '@utils/apis/question';
import { FlexRow, LayoutBase } from 'src/design-system/layouts';

const isValidQuestionId = (questionId?: string): questionId is string =>
  !!questionId && /^\d+$/.test(questionId);

function NewResponse() {
  const { questionId } = useParams();
  const currentUser = useBoundStore.getState().myProfile;

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

  const [newResponse, setNewResponse] = useState('');
  const handleChangeResponse = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewResponse(e.target.value);
  };

  const navigate = useNavigate();
  const handleClickCancel = () => {
    navigate(-1);
  };

  const handleClickPost = async () => {
    if (!questionId) return;
    await responseQuestion({ question_id: Number(questionId), content: newResponse });
    // TODO: 포스팅 완료 토스트 연동
    navigate('/my');
  };

  const disabledPost = !newResponse.trim().length;

  return (
    <MainContainer>
      <SubHeader
        title={t('new_response')}
        LeftComponent={
          <button type="button" onClick={handleClickCancel}>
            <Typo type="title-large">{t('cancel')}</Typo>
          </button>
        }
        RightComponent={
          <button type="button" onClick={handleClickPost} disabled={disabledPost}>
            <Typo type="title-large" color={disabledPost ? 'MEDIUM_GRAY' : 'PRIMARY'}>
              {t('post')}
            </Typo>
          </button>
        }
      />
      <LayoutBase mt={TITLE_HEADER_HEIGHT} w="100%" pt={20} ph={12}>
        {currentUser && (
          <FlexRow gap={4} alignItems="center" mb={12}>
            <ProfileImage
              imageUrl={currentUser.profile_image}
              username={currentUser.username}
              size={44}
            />
            <Typo type="title-medium">{currentUser.username}</Typo>
          </FlexRow>
        )}

        {question.state === 'loading' && <Loader />}
        {question.state === 'hasValue' && (
          <>
            <TextArea
              placeholder={t('what_is_your_response') || ''}
              value={newResponse}
              onChange={handleChangeResponse}
            />
            <StyledNewResponsePrompt>
              <FlexRow gap={8} alignItems="center" mb={12}>
                <ProfileImage imageUrl="/whoami-profile.svg" username="Whoami Today" size={28} />
                <Typo type="title-medium">Whoami Today</Typo>
              </FlexRow>
              <Typo type="body-large">{question.data.content}</Typo>
            </StyledNewResponsePrompt>
          </>
        )}
      </LayoutBase>
    </MainContainer>
  );
}

export default NewResponse;
