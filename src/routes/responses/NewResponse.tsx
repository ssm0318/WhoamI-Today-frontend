import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Loader } from '@components/_common/loader/Loader.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import NoContents from '@components/_common/no-contents/NoContents';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { StyledNewResponsePrompt } from '@components/_common/prompt/PromptCard.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { TextArea, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { Question } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getQuestionDetail, patchResponse, postResponse } from '@utils/apis/question';
import { FlexRow, LayoutBase } from 'src/design-system/layouts';

const isValidQuestionId = (questionId?: string): questionId is string =>
  !!questionId && /^\d+$/.test(questionId);

function NewResponse() {
  const location = useLocation();
  const { questionId } = useParams();
  const status = location.state?.status;
  const content = location.state?.post.content || '';
  const currentUser = useBoundStore.getState().myProfile;

  const [t] = useTranslation('translation');
  const [question, setQuestion] = useState<FetchState<Question>>({ state: 'loading' });
  const title = !location.state
    ? t('question.response.new_response')
    : t('question.response.edit_response');

  useAsyncEffect(async () => {
    if (!isValidQuestionId(questionId)) {
      setQuestion({ state: 'hasError' });
      return;
    }

    getQuestionDetail(questionId)
      .then((data) => {
        setQuestion({ state: 'hasValue', data });
      })
      .catch(() => {
        setQuestion({ state: 'hasError' });
      });
  }, []);

  const [newResponse, setNewResponse] = useState(content);
  const handleChangeResponse = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewResponse(e.target.value);
  };

  const navigate = useNavigate();
  const handleClickCancel = () => {
    navigate(-1);
  };

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));
  const handleClickPost = async () => {
    if (!questionId) return;
    navigate('/my');
    openToast({ message: t('question.response.posting') });
    const { id: newResponseId } =
      status !== 'edit'
        ? await postResponse({
            question_id: Number(questionId),
            content: newResponse,
          })
        : await patchResponse({
            post_id: location.state?.post.id,
            content: newResponse,
          });

    openToast({
      message: t(status === 'edit' ? 'question.response.edited' : 'question.response.posted'),
      actionText: t('question.response.view'),
      action: () => navigate(`/responses/${newResponseId}`),
    });
  };

  const disabledPost = !newResponse.trim().length;

  return (
    <MainContainer>
      <SubHeader
        title={title}
        LeftComponent={
          <button type="button" onClick={handleClickCancel}>
            <Typo type="title-large">{t('question.response.cancel')}</Typo>
          </button>
        }
        RightComponent={
          <button type="button" onClick={handleClickPost} disabled={disabledPost}>
            <Typo type="title-large" color={disabledPost ? 'MEDIUM_GRAY' : 'PRIMARY'}>
              {t('question.response.post')}
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
              placeholder={t('question.response.what_is_your_response') || ''}
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
        {question.state === 'hasError' && <NoContents text={t('no_contents.question')} />}
      </LayoutBase>
    </MainContainer>
  );
}

export default NewResponse;
