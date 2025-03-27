import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Loader } from '@components/_common/loader/Loader.styled';
import NoContents from '@components/_common/no-contents/NoContents';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { StyledNewResponsePrompt } from '@components/_common/prompt/PromptCard.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, RadioButton, TextArea, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { PostVisibility, Question } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getQuestionDetail, patchResponse, postResponse } from '@utils/apis/question';
import { getResponse } from '@utils/apis/responses';
import { FlexRow, LayoutBase } from 'src/design-system/layouts';
import { MainScrollContainer } from '../Root';

const isValidQuestionId = (questionId?: string): questionId is string =>
  !!questionId && /^\d+$/.test(questionId);

function NewResponse() {
  const location = useLocation();
  const { questionId, responseId } = useParams();
  const isEdit = location.pathname.includes('/edit');

  const currentUser = useBoundStore.getState().myProfile;

  const [t] = useTranslation('translation');
  const [question, setQuestion] = useState<FetchState<Question>>({ state: 'loading' });

  const [newResponse, setNewResponse] = useState<string | null>(null);

  // NOTE: QUESTION_RESPONSE_FEATURE 플래그가 true인 경우만 해당 NewResponse 페이지 노출
  // 따라서 Note처럼 공개 범위 분기가 필요없음
  const [visibility, setVisibility] = useState<PostVisibility>(PostVisibility.CLOSE_FRIENDS);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useAsyncEffect(async () => {
    if (isEdit && responseId) {
      getResponse(responseId).then((data) => {
        if (data && data.content) {
          setNewResponse(data.content);
          setVisibility(data.visibility);
        }
        if (data && data.question && data.question.id) {
          const editQuestionId = data.question.id;

          if (isValidQuestionId(String(editQuestionId))) {
            getQuestionDetail(String(editQuestionId))
              .then((questionData) => {
                setQuestion({ state: 'hasValue', data: questionData });
              })
              .catch(() => {
                setQuestion({ state: 'hasError' });
              });
          } else {
            setQuestion({ state: 'hasError' });
          }
        }
      });
    }
  }, [isEdit]);

  const handleChangeResponse = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewResponse(e.target.value);
  };

  const handleChangeVisibility = (e: ChangeEvent<HTMLInputElement>) => {
    setVisibility(e.target.value as PostVisibility);
  };

  const navigate = useNavigate();
  const handleClickCancel = () => {
    navigate(-1);
  };

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));
  const handleClickPost = async () => {
    if ((!questionId && !responseId) || isSubmitting) return;

    setIsSubmitting(true);
    try {
      navigate('/my');
      openToast({ message: t('question.response.posting') });
      const { id: newResponseId } = !isEdit
        ? await postResponse({
            question_id: Number(questionId),
            content: newResponse || '',
            visibility,
          })
        : await patchResponse({
            post_id: Number(responseId),
            content: newResponse || '',
            visibility,
          });

      openToast({
        message: t(isEdit ? 'question.response.edited' : 'question.response.posted'),
        actionText: t('question.response.view'),
      });

      navigate(`/responses/${newResponseId}`, { state: 'new' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledPost = !newResponse?.trim().length || isSubmitting;

  return (
    <MainScrollContainer>
      <SubHeader
        title={title}
        LeftComponent={
          <button type="button" onClick={handleClickCancel} disabled={isSubmitting}>
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
      <LayoutBase w="100%" pt={20} ph={12} pb={50}>
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
              value={newResponse || ''}
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
        {/** visibility options */}
        <FlexRow pt={15} w="100%" justifyContent="flex-end">
          <Layout.FlexCol gap={2} bgColor="LIGHT" p={6} rounded={8}>
            <Typo type="label-medium" bold mb={4} fontSize={11}>
              {t('access_setting.title')}
            </Typo>
            <Layout.FlexCol justifyContent="flex-start" w="100%" gap={4}>
              <RadioButton
                label={t('access_setting.friend') || ''}
                name="friends"
                value="friends"
                checked={visibility === 'friends'}
                onChange={handleChangeVisibility}
                labelType="label-medium"
                buttonSize="small"
              />
              <RadioButton
                label={t('access_setting.close_friend') || ''}
                name="close_friends"
                value="close_friends"
                checked={visibility === 'close_friends'}
                onChange={handleChangeVisibility}
                labelType="label-medium"
                buttonSize="small"
              />
            </Layout.FlexCol>
          </Layout.FlexCol>
        </FlexRow>
        <FlexRow w="100%" justifyContent="flex-end" pt={10}>
          <Typo type="label-medium" color="MEDIUM_GRAY" mt={8}>
            {t('question.response.content_restriction')}
          </Typo>
        </FlexRow>
      </LayoutBase>
    </MainScrollContainer>
  );
}

export default NewResponse;
