import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import { DEFAULT_MARGIN } from '@constants/layout';
import { CheckBox, Layout, SvgIcon, Typo } from '@design-system';
import { useGetAppMessage, usePostAppMessage } from '@hooks/useAppMessage';
import { FileSelectedData } from '@models/app';
import { ComponentVisibility } from '@models/checkIn';
import { NewNoteForm, PostVisibility } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import { processImageFromApp } from '@utils/imageHelpers';
import { isVideoFile, processVideoFromApp, validateVideoFile } from '@utils/videoHelpers';
import { FlexRow } from 'src/design-system/layouts';
import NewNoteImageEdit from '../new-note-image-edit/NewNoteImageEdit';
import NewNotePhotoUploadBottomSheet from '../new-note-photo-upload-bottom-sheet/NewNotePhotoUploadBottomSheet';
import { NoteImage } from '../note-image/NoteImage.styled';
import { NoteInput } from './NoteInputBox.styled';

interface NoteInformationProps {
  noteInfo: NewNoteForm;
  setNoteInfo: React.Dispatch<React.SetStateAction<NewNoteForm>>;
  autoOpenImagePicker?: boolean;
  placeholder?: string;
}

function NewNoteContent({
  noteInfo,
  setNoteInfo,
  autoOpenImagePicker,
  placeholder,
}: NoteInformationProps) {
  const [t] = useTranslation('translation');
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const { featureFlags } = useBoundStore(UserSelector);

  const [isEditVisible, setIsEditVisible] = useState(false);
  const [showPhotoUploadBottomSheet, setShowPhotoUploadBottomSheet] = useState(false);

  const [editImageUrl, setEditImageUrl] = useState<string>();
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>();

  const inputRef = useRef<HTMLInputElement>(null);
  const { isAndroid } = getMobileDeviceInfo();
  const postMessage = usePostAppMessage();
  const hasAutoOpenedRef = useRef(false);

  useEffect(() => {
    if (autoOpenImagePicker && !hasAutoOpenedRef.current) {
      hasAutoOpenedRef.current = true;
      // Delay slightly to ensure DOM is ready
      const timer = setTimeout(() => onClickAdd(), 100);
      return () => clearTimeout(timer);
    }
  }, [autoOpenImagePicker]); // eslint-disable-line react-hooks/exhaustive-deps

  // 앱에서 파일 선택 완료 시 호출되는 콜백
  const handleFileSelected = async (data: FileSelectedData) => {
    if (data.isVideo) {
      const videoFile = processVideoFromApp(data);
      if (videoFile) {
        const error = validateVideoFile(videoFile);
        if (error) {
          openToast({ message: error });
          return;
        }
        const previewUrl = URL.createObjectURL(videoFile);
        setVideoPreviewUrl(previewUrl);
        setNoteInfo((prevNoteInfo) => ({
          ...prevNoteInfo,
          video: videoFile,
          images: [],
        }));
      }
      return;
    }

    const result = await processImageFromApp(data, (message) => openToast({ message }));

    if (result) {
      setNoteInfo((prevNoteInfo) => ({
        ...prevNoteInfo,
        images: [result],
        video: undefined,
      }));
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
        setVideoPreviewUrl(undefined);
      }
    }
  };

  // 앱에서 파일 선택 이벤트 리스닝
  useGetAppMessage({
    key: 'FILE_SELECTED',
    cb: handleFileSelected,
  });

  const onClickAdd = () => {
    /* Show camera/gallery choice for Photo of the Day or Android */
    if (isAndroid || autoOpenImagePicker) {
      setShowPhotoUploadBottomSheet(true);
      return;
    }

    if (noteInfo.images && noteInfo.images.length < 10) {
      inputRef.current?.click();
    } else {
      openToast({
        message: t('notes.max_images_error') || '최대 10장까지만 첨부할 수 있습니다',
      });
    }
  };

  const handleOpenCamera = () => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_CAMERA', {});
    } else {
      // On web, open file input (camera not available)
      inputRef.current?.click();
    }
  };

  const handleOpenAlbum = () => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_GALLERY', {});
    } else {
      inputRef.current?.click();
    }
  };

  const closePhotoUploadBottomSheet = () => {
    setShowPhotoUploadBottomSheet(false);
  };

  const onFileAdd = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (isVideoFile(file)) {
      const error = validateVideoFile(file);
      if (error) {
        openToast({ message: error });
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(previewUrl);
      setNoteInfo((prevNoteInfo) => ({
        ...prevNoteInfo,
        video: file,
        images: [],
      }));
      return;
    }

    try {
      const imageDataUrl = await readFile(file);

      if (typeof imageDataUrl !== 'string') {
        throw new Error('read file error');
      }
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
        setVideoPreviewUrl(undefined);
      }
      setEditImageUrl(imageDataUrl);
      setIsEditVisible(true);
    } catch (error) {
      openToast({
        message: (error as Error).message,
      });
    }
  };

  const handleChangeVisibility = (visibilities: PostVisibility[]) => {
    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      visibility: visibilities,
    }));
  };

  const onCompleteImageCrop = (croppedImage: CroppedImg) => {
    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      images: [croppedImage],
      video: undefined,
    }));
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(undefined);
    }
  };

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      content: e.target.value,
    }));
  };

  const handleDeleteImage = () => {
    if (!noteInfo.images) return;

    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      images: [],
    }));
  };

  const handleDeleteVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(undefined);
    }
    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      video: undefined,
    }));
  };

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <Layout.FlexCol w="100%" ph={DEFAULT_MARGIN} pv={12} gap={16} pb={100}>
          <Layout.FlexRow w="100%" alignItems="center" gap={8} pv={8}>
            <ProfileImage
              imageUrl={myProfile?.profile_image}
              username={myProfile?.username}
              size={50}
            />
            <Typo type="title-medium">{myProfile?.username}</Typo>
          </Layout.FlexRow>

          {/* Text input */}
          <NoteInput
            value={noteInfo.content}
            placeholder={placeholder || t('notes.whats_on_your_mind') || ''}
            onChange={handleChangeInput}
            minRows={4}
            maxRows={10}
            style={{
              marginBottom: 20,
              overflow: 'auto',
            }}
          />

          {/* Media button and visibility options */}
          <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center" mt={20}>
            <SvgIcon name="chat_media_image" size={24} onClick={onClickAdd} fill="DARK_GRAY" />
            {featureFlags?.postsVerQ ? (
              <Layout.FlexRow gap={6} alignItems="center">
                <CheckBox
                  name={t('notes.close_friends_only') || 'Close friends only'}
                  checked={noteInfo.visibility[0] === PostVisibility.CLOSE_FRIENDS}
                  onChange={() =>
                    handleChangeVisibility([
                      noteInfo.visibility[0] === PostVisibility.CLOSE_FRIENDS
                        ? myProfile?.is_public
                          ? PostVisibility.PUBLIC
                          : PostVisibility.FRIENDS
                        : PostVisibility.CLOSE_FRIENDS,
                    ])
                  }
                />
                <Typo type="label-medium" color="DARK_GRAY">
                  {t('notes.close_friends_only')}
                </Typo>
              </Layout.FlexRow>
            ) : (
              <VisibilityToggle
                value={
                  (noteInfo.visibility[0] as unknown as ComponentVisibility) ||
                  ComponentVisibility.FRIENDS
                }
                onChange={(v) => handleChangeVisibility([v as unknown as PostVisibility])}
              />
            )}
          </Layout.FlexRow>

          {/* 첨부한 노트 이미지 */}
          {noteInfo?.images && noteInfo.images.length > 0 && (
            <Layout.FlexCol w="100%">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {noteInfo.images[0] && noteInfo.images[0].url && (
                  <NoteImage
                    src={noteInfo.images[0].url}
                    alt="Note image"
                    style={{
                      maxWidth: 50,
                      height: 'auto',
                      display: 'block',
                      borderRadius: 8,
                    }}
                  />
                )}
                <Layout.Absolute t={-4} r={-4}>
                  <SvgIcon name="delete_image" size={32} onClick={handleDeleteImage} />
                </Layout.Absolute>
              </div>
            </Layout.FlexCol>
          )}

          {/* 첨부한 동영상 */}
          {noteInfo?.video && videoPreviewUrl && (
            <Layout.FlexCol w="100%">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src={videoPreviewUrl}
                  style={{
                    maxWidth: 50,
                    height: 'auto',
                    display: 'block',
                    borderRadius: 8,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <polygon points="8,5 19,12 8,19" />
                  </svg>
                </div>
                <Layout.Absolute t={-4} r={-4}>
                  <SvgIcon name="delete_image" size={32} onClick={handleDeleteVideo} />
                </Layout.Absolute>
              </div>
            </Layout.FlexCol>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg, image/png, video/mp4, video/quicktime, video/webm"
            onChange={onFileAdd}
            multiple={false}
            style={{ display: 'none' }}
          />

          <FlexRow w="100%" justifyContent="flex-end" alignItems="center" mt={12}>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {t('notes.content_restriction')}
            </Typo>
          </FlexRow>
        </Layout.FlexCol>
      </div>

      {isEditVisible && (
        <NewNoteImageEdit
          imageUrl={editImageUrl}
          setIsVisible={setIsEditVisible}
          onCompleteImageCrop={onCompleteImageCrop}
        />
      )}

      <NewNotePhotoUploadBottomSheet
        visible={showPhotoUploadBottomSheet}
        closeBottomSheet={closePhotoUploadBottomSheet}
        onClickOpenCamera={handleOpenCamera}
        onClickOpenAlbum={handleOpenAlbum}
      />
    </>
  );
}

export default NewNoteContent;
