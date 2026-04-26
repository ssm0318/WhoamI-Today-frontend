import { AxiosError } from 'axios';
import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import UploadLoadingOverlay from '@components/_common/upload-loading-overlay/UploadLoadingOverlay';
import NewNoteImageEdit from '@components/note/new-note-image-edit/NewNoteImageEdit';
import { NoteImage, NoteImageWrapper } from '@components/note/note-image/NoteImage.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { DEFAULT_MARGIN } from '@constants/layout';
import { CheckBox, Layout, SvgIcon, Typo } from '@design-system';
import { useDelayedVisible } from '@hooks/useDelayedVisible';
import { NewCheckInPostForm } from '@models/checkInPost';
import { useBoundStore } from '@stores/useBoundStore';
import { postCheckInPost } from '@utils/apis/checkInPost';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import { MainScrollContainer } from '../Root';

function NewCheckInPost() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();
  const { myProfile, openToast } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    openToast: state.openToast,
  }));

  const inputRef = useRef<HTMLInputElement>(null);
  const [editImageUrl, setEditImageUrl] = useState<string>();
  const [isEditVisible, setIsEditVisible] = useState(false);

  const [form, setForm] = useState<NewCheckInPostForm>({
    image: null,
    caption: '',
    closeFriendsOnly: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const showUploadOverlay = useDelayedVisible(isSubmitting);

  const onClickAdd = () => inputRef.current?.click();

  const onImageAdd = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const image = e.target.files[0];
    try {
      const imageDataUrl = await readFile(image);
      if (typeof imageDataUrl !== 'string') throw new Error('read file error');
      setEditImageUrl(imageDataUrl);
      setIsEditVisible(true);
    } catch (error) {
      openToast({ message: (error as Error).message });
    }
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
      openToast({ message: t('notes.posted') ?? '' });
      navigate('/feed');
    } catch (e) {
      const err = e as AxiosError<{ error?: string }>;
      openToast({
        message: err.response?.data?.error || t('notes.temporary_error') || '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = !!form.image && !isSubmitting;

  return (
    <MainScrollContainer>
      <SubHeader
        title={t('check_in_post.new_title') || 'New Daily Snippet'}
        RightComponent={
          <button type="button" onClick={handleShare} disabled={!canSubmit}>
            <Typo type="title-large" color={canSubmit ? 'PRIMARY' : 'MEDIUM_GRAY'}>
              {t('notes.post')}
            </Typo>
          </button>
        }
        onGoBack={handleCancel}
      />
      <Layout.FlexCol w="100%" ph={DEFAULT_MARGIN} pv={12} gap={16} pb={100}>
        <Layout.FlexRow w="100%" alignItems="center" gap={8} pv={8}>
          <ProfileImage
            imageUrl={myProfile?.profile_image}
            username={myProfile?.username}
            size={50}
          />
          <Typo type="title-medium">{myProfile?.username}</Typo>
        </Layout.FlexRow>

        <textarea
          value={form.caption}
          placeholder={t('notes.whats_on_your_mind') || ''}
          onChange={handleChangeCaption}
          rows={4}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: 16,
            padding: 8,
            background: 'transparent',
          }}
        />

        {form.image?.url ? (
          <Layout.FlexCol w="100%" alignItems="center" mt={16}>
            <NoteImageWrapper ph={DEFAULT_MARGIN} style={{ width: '100%' }}>
              <NoteImage src={form.image.url} alt="daily snippet" />
              <Layout.Absolute t={0} r={15}>
                <SvgIcon name="delete_image" size={50} onClick={handleDeleteImage} />
              </Layout.Absolute>
            </NoteImageWrapper>
          </Layout.FlexCol>
        ) : (
          <Layout.FlexRow w="100%" alignItems="center" justifyContent="flex-start" mt={20}>
            <SvgIcon name="chat_media_image" size={24} onClick={onClickAdd} fill="DARK_GRAY" />
          </Layout.FlexRow>
        )}

        <Layout.FlexRow w="100%" justifyContent="flex-end" alignItems="center" mt={20} gap={6}>
          <CheckBox
            name={t('notes.close_friends_only') || 'Close friends only'}
            checked={form.closeFriendsOnly}
            onChange={handleToggleCloseFriendsOnly}
          />
        </Layout.FlexRow>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg, image/png"
          onChange={onImageAdd}
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
