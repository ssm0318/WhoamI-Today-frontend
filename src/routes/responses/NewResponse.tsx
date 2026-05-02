import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Loader } from '@components/_common/loader/Loader.styled';
import NoContents from '@components/_common/no-contents/NoContents';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { StyledNewResponsePrompt } from '@components/_common/prompt/PromptCard.styled';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import NewNoteImageEdit from '@components/note/new-note-image-edit/NewNoteImageEdit';
import { NoteImage } from '@components/note/note-image/NoteImage.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { CheckBox, Layout, SvgIcon, TextArea, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { ComponentVisibility } from '@models/checkIn';
import { PostVisibility, Question } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getQuestionDetail, patchResponse, postResponse } from '@utils/apis/question';
import { getResponse } from '@utils/apis/responses';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import { FlexRow, LayoutBase } from 'src/design-system/layouts';
import { MainScrollContainer } from '../Root';

const isValidQuestionId = (questionId?: string): questionId is string =>
  !!questionId && /^\d+$/.test(questionId);

function NewResponse() {
  const location = useLocation();
  const { questionId, responseId } = useParams();
  const isEdit = location.pathname.includes('/edit');

  const currentUser = useBoundStore.getState().myProfile;
  const { featureFlags } = useBoundStore(UserSelector);

  const [t] = useTranslation('translation');
  const [question, setQuestion] = useState<FetchState<Question>>({ state: 'loading' });

  const [newResponse, setNewResponse] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<CroppedImg | null>(null);
  const [editImageUrl, setEditImageUrl] = useState<string>();
  const [isEditVisible, setIsEditVisible] = useState(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const defaultVisibility = currentUser?.is_public ? PostVisibility.PUBLIC : PostVisibility.FRIENDS;
  const [visibilityList, setVisibilityList] = useState<PostVisibility[]>([defaultVisibility]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = !isEdit
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
          setVisibilityList(data.visibility);
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

  const handleFileAdd = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    try {
      const imageDataUrl = await readFile(file);
      if (typeof imageDataUrl !== 'string') throw new Error('read file error');
      setEditImageUrl(imageDataUrl);
      setIsEditVisible(true);
    } catch (error) {
      openToast({ message: (error as Error).message });
    }
  };

  const onCompleteImageCrop = (croppedImage: CroppedImg) => {
    setImageFile(croppedImage);
  };

  const handleDeleteImage = () => {
    setImageFile(null);
  };

  const handleChangeVisibility = (visibility: ComponentVisibility) => {
    setVisibilityList([visibility as unknown as PostVisibility]);
  };

  const currentVisibility =
    (visibilityList[0] as unknown as ComponentVisibility | undefined) ??
    ComponentVisibility.ONLY_ME;

  const navigate = useNavigate();
  const handleClickCancel = () => {
    if (window.ReactNativeWebView && window.history.length <= 1) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ actionType: 'NAVIGATE_TO_BASE' }));
      return;
    }
    navigate(-1);
  };

  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));
  const handleClickPost = async () => {
    if ((!questionId && !responseId) || isSubmitting) return;

    setIsSubmitting(true);
    openToast({ message: t('question.response.posting') });
    try {
      const { id: newResponseId } = !isEdit
        ? await postResponse({
            question_id: Number(questionId),
            content: newResponse || '',
            visibility: visibilityList,
            image: imageFile?.file || undefined,
          })
        : await patchResponse({
            post_id: Number(responseId),
            content: newResponse || '',
            visibility: visibilityList,
          });

      navigate(`/responses/${newResponseId}`, { state: 'new' });
      openToast({
        message: t(isEdit ? 'question.response.edited' : 'question.response.posted'),
        actionText: t('question.response.view'),
      });
    } catch {
      openToast({ message: t('question.response.temporary_error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledPost = !newResponse?.trim().length || isSubmitting;

  return (
    <MainScrollContainer style={{ display: 'flex', flexDirection: 'column' }}>
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
      <LayoutBase w="100%" pt={20} ph={12} pb={50} style={{ flexGrow: 1, overflow: 'auto' }}>
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
            <ResponseInputSection>
              <TextArea
                placeholder={t('question.response.what_is_your_response') || ''}
                value={newResponse || ''}
                onChange={handleChangeResponse}
                minRows={6}
                maxRows={20}
              />
            </ResponseInputSection>
            {!isEdit && (
              <ResponseMediaSection>
                <FlexRow mb={12}>
                  <SvgIcon
                    name="chat_media_image"
                    size={24}
                    fill="DARK_GRAY"
                    onClick={() => mediaInputRef.current?.click()}
                  />
                </FlexRow>
                {/* Image preview */}
                {imageFile?.url && (
                  <ImagePreviewWrap>
                    <NoteImage
                      src={imageFile.url}
                      alt="response image"
                      style={{
                        maxWidth: 80,
                        height: 'auto',
                        display: 'block',
                        borderRadius: 6,
                      }}
                    />
                    <DeleteBtn onClick={handleDeleteImage}>
                      <SvgIcon name="close" size={14} />
                    </DeleteBtn>
                  </ImagePreviewWrap>
                )}
              </ResponseMediaSection>
            )}
            {!isEdit && (
              <input
                ref={mediaInputRef}
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleFileAdd}
                style={{ display: 'none' }}
              />
            )}

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
          {featureFlags?.postsVerQ ? (
            <Layout.FlexRow gap={6} alignItems="center">
              <CheckBox
                name={t('notes.close_friends_only') || 'Close friends only'}
                checked={visibilityList[0] === PostVisibility.CLOSE_FRIENDS}
                onChange={() =>
                  setVisibilityList([
                    visibilityList[0] === PostVisibility.CLOSE_FRIENDS
                      ? currentUser?.is_public
                        ? PostVisibility.PUBLIC
                        : PostVisibility.FRIENDS
                      : PostVisibility.CLOSE_FRIENDS,
                  ])
                }
              />
            </Layout.FlexRow>
          ) : (
            <VisibilityToggle value={currentVisibility} onChange={handleChangeVisibility} />
          )}
        </FlexRow>
        <FlexRow w="100%" justifyContent="flex-end" pt={10}>
          <Typo type="label-medium" color="MEDIUM_GRAY" mt={8}>
            {t('question.response.content_restriction')}
          </Typo>
        </FlexRow>
      </LayoutBase>

      {isEditVisible && (
        <NewNoteImageEdit
          imageUrl={editImageUrl}
          setIsVisible={setIsEditVisible}
          onCompleteImageCrop={onCompleteImageCrop}
        />
      )}
    </MainScrollContainer>
  );
}

export default NewResponse;

const ImagePreviewWrap = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
`;

const ResponseInputSection = styled.div`
  width: 100%;
  margin-bottom: 12px;
`;

const ResponseMediaSection = styled.div`
  width: 100%;
  margin-bottom: 12px;
`;

const DeleteBtn = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
`;
