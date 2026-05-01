import { AxiosError } from 'axios';
import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import UploadLoadingOverlay from '@components/_common/upload-loading-overlay/UploadLoadingOverlay';
import NewNoteImageEdit from '@components/note/new-note-image-edit/NewNoteImageEdit';
import SubHeader from '@components/sub-header/SubHeader';
import { DEFAULT_MARGIN } from '@constants/layout';
import { CheckBox, Layout, SvgIcon, Typo } from '@design-system';
import { useDelayedVisible } from '@hooks/useDelayedVisible';
import { NewCheckInPostForm } from '@models/checkInPost';
import { useBoundStore } from '@stores/useBoundStore';
import { postCheckInPost } from '@utils/apis/checkInPost';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import { MainScrollContainer } from '../Root';
import * as S from './NewCheckInPost.styled';

function NewCheckInPost() {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_post' });
  const [tNotes] = useTranslation('translation', { keyPrefix: 'notes' });
  const navigate = useNavigate();
  const { openToast } = useBoundStore((state) => ({
    openToast: state.openToast,
  }));

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [editImageUrl, setEditImageUrl] = useState<string>();
  const [isEditVisible, setIsEditVisible] = useState(false);

  const [form, setForm] = useState<NewCheckInPostForm>({
    image: null,
    caption: '',
    closeFriendsOnly: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const showUploadOverlay = useDelayedVisible(isSubmitting);

  const onClickGallery = () => galleryInputRef.current?.click();
  const onClickCamera = () => cameraInputRef.current?.click();

  const onFileAdd = async (e: ChangeEvent<HTMLInputElement>) => {
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

    e.target.value = '';
  };

  const onCompleteImageCrop = (croppedImage: CroppedImg) => {
    setForm((prev) => ({ ...prev, image: croppedImage }));
  };

  const handleDeleteImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
  };

  const handleChangeCaption = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, caption: e.target.value }));
  };

  const handleToggleCloseFriendsOnly = () => {
    setForm((prev) => ({ ...prev, closeFriendsOnly: !prev.closeFriendsOnly }));
  };

  const handleCancel = () => navigate(-1);

  const handleShare = async () => {
    if (isSubmitting || !form.image) return;
    setIsSubmitting(true);
    try {
      await postCheckInPost(form);
      openToast({ message: tNotes('posted') ?? '' });
      navigate('/feed');
    } catch (e) {
      const err = e as AxiosError<{ error?: string }>;
      openToast({
        message: err.response?.data?.error || tNotes('temporary_error') || '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = !!form.image && !isSubmitting;

  return (
    <MainScrollContainer>
      <SubHeader
        title={t('new_title') || 'New Daily Snippet'}
        RightComponent={
          <button type="button" onClick={handleShare} disabled={!canSubmit}>
            <Typo type="title-large" color={canSubmit ? 'PRIMARY' : 'MEDIUM_GRAY'}>
              {tNotes('post')}
            </Typo>
          </button>
        }
        onGoBack={handleCancel}
      />
      <Layout.FlexCol w="100%" ph={DEFAULT_MARGIN} pv={20} gap={0} pb={100}>
        {form.image?.url ? (
          <>
            <S.PhotoPreviewContainer>
              <S.PreviewImage src={form.image.url} alt="daily snippet" />
              <Layout.Absolute t={8} r={8}>
                <SvgIcon name="delete_image" size={32} onClick={handleDeleteImage} />
              </Layout.Absolute>
            </S.PhotoPreviewContainer>
            <Layout.FlexRow gap={8} mt={12}>
              <S.ActionPill type="button" onClick={onClickGallery}>
                <SvgIcon name="chat_media_image" size={18} fill="DARK_GRAY" />
                <Typo type="label-medium" color="DARK_GRAY">
                  {t('change_photo')}
                </Typo>
              </S.ActionPill>
              <S.ActionPill type="button" onClick={onClickCamera}>
                <SvgIcon name="camera" size={18} fill="DARK_GRAY" />
                <Typo type="label-medium" color="DARK_GRAY">
                  {t('retake')}
                </Typo>
              </S.ActionPill>
            </Layout.FlexRow>
          </>
        ) : (
          <S.PhotoPlaceholder>
            <SvgIcon name="camera" size={40} fill="MEDIUM_GRAY" />
            <Typo type="body-medium" color="MEDIUM_GRAY" mt={12}>
              {t('add_photo_prompt')}
            </Typo>
            <Layout.FlexRow gap={12} mt={20}>
              <S.PhotoOptionButton type="button" onClick={onClickGallery}>
                <SvgIcon name="chat_media_image" size={20} fill="DARK_GRAY" />
                <Typo type="label-large" color="DARK_GRAY">
                  {t('choose_photo')}
                </Typo>
              </S.PhotoOptionButton>
              <S.PhotoOptionButton type="button" onClick={onClickCamera}>
                <SvgIcon name="camera" size={20} fill="DARK_GRAY" />
                <Typo type="label-large" color="DARK_GRAY">
                  {t('take_photo')}
                </Typo>
              </S.PhotoOptionButton>
            </Layout.FlexRow>
          </S.PhotoPlaceholder>
        )}

        <S.CaptionInput
          value={form.caption}
          placeholder={t('add_caption_placeholder') || ''}
          onChange={handleChangeCaption}
          rows={3}
        />

        <Layout.FlexRow w="100%" justifyContent="flex-end" alignItems="center" mt={16} gap={6}>
          <CheckBox
            name={tNotes('close_friends_only') || 'Close friends only'}
            checked={form.closeFriendsOnly}
            onChange={handleToggleCloseFriendsOnly}
          />
        </Layout.FlexRow>

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg, image/png"
          onChange={onFileAdd}
          multiple={false}
          style={{ display: 'none' }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg, image/png"
          capture="environment"
          onChange={onFileAdd}
          multiple={false}
          style={{ display: 'none' }}
        />
      </Layout.FlexCol>

      {isEditVisible && (
        <NewNoteImageEdit
          imageUrl={editImageUrl}
          setIsVisible={setIsEditVisible}
          onCompleteImageCrop={onCompleteImageCrop}
        />
      )}

      <UploadLoadingOverlay visible={showUploadOverlay} />
    </MainScrollContainer>
  );
}

export default NewCheckInPost;
