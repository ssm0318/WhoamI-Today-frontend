import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import { Loader } from '@components/_common/loader/Loader.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import NoContents from '@components/_common/no-contents/NoContents';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { StyledNewResponsePrompt } from '@components/_common/prompt/PromptCard.styled';
import VisibilityTypeOption from '@components/note/connection-type/ConnectionTypeOption';
import SubHeader from '@components/sub-header/SubHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { TextArea, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { PostVisibility, Question } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { getQuestionDetail, patchResponse, postResponse } from '@utils/apis/question';
import { getResponse } from '@utils/apis/responses';
import { FlexRow, LayoutBase } from 'src/design-system/layouts';

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
  const [showEditConnectionsModal, setShowEditConnectionsModal] = useState(false);

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

  const handleClickChangeConnection = () => {
    setShowEditConnectionsModal(true);
  };

  const closeEditConnectionsModal = () => setShowEditConnectionsModal(false);

  const navigate = useNavigate();
  const handleClickCancel = () => {
    navigate(-1);
  };

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));
  const handleClickPost = async () => {
    if (!questionId && !responseId) return;
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
    openToast({ message: t('question.response.posting') });
  };

  const disabledPost = !newResponse?.trim().length;

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
        {/** connections */}
        <FlexRow pt={15} w="100%" justifyContent="flex-end">
          <FlexRow
            onClick={handleClickChangeConnection}
            bgColor="SECONDARY"
            pl={10}
            pr={8}
            pv={5}
            rounded={8}
            gap={5}
            alignItems="center"
            justifyContent="center"
          >
            <Typo type="label-large" color="BLACK">
              {visibility === PostVisibility.CLOSE_FRIENDS
                ? t('user_page.connection.close_friend')
                : t('user_page.connection.friend')}
            </Typo>
            <Icon name="chevron_down" size={18} color="BLACK" />
          </FlexRow>
          {showEditConnectionsModal && (
            <VisibilityTypeOption
              type={visibility}
              setType={setVisibility}
              visible={showEditConnectionsModal}
              closeBottomSheet={closeEditConnectionsModal}
            />
          )}
        </FlexRow>
        <FlexRow w="100%" justifyContent="flex-end" pt={10}>
          <Typo type="label-medium" color="MEDIUM_GRAY" mt={8}>
            {t('question.response.content_restriction')}
          </Typo>
        </FlexRow>
      </LayoutBase>
    </MainContainer>
  );
}

export default NewResponse;
