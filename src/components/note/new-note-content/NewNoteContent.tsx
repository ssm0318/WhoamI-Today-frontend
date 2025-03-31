import React, { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { DEFAULT_MARGIN } from '@constants/layout';
import { Layout, RadioButton, SvgIcon, Typo } from '@design-system';
import { useGetAppMessage, usePostAppMessage } from '@hooks/useAppMessage';
import { FileSelectedData } from '@models/app';
import { NewNoteForm, PostVisibility } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import { processImageFromApp } from '@utils/imageHelpers';
import { FlexRow } from 'src/design-system/layouts';
import NewNoteImageEdit from '../new-note-image-edit/NewNoteImageEdit';
import NewNotePhotoUploadBottomSheet from '../new-note-photo-upload-bottom-sheet/NewNotePhotoUploadBottomSheet';
import { NoteImage, NoteImageWrapper } from '../note-image/NoteImage.styled';
import { NoteInput } from './NoteInputBox.styled';

interface NoteInformationProps {
  noteInfo: NewNoteForm;
  setNoteInfo: React.Dispatch<React.SetStateAction<NewNoteForm>>;
}

function NewNoteContent({ noteInfo, setNoteInfo }: NoteInformationProps) {
  const [t] = useTranslation('translation');
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));
  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const { visibility } = noteInfo;

  const [isEditVisible, setIsEditVisible] = useState(false);
  const [showPhotoUploadBottomSheet, setShowPhotoUploadBottomSheet] = useState(false);

  const [editImageUrl, setEditImageUrl] = useState<string>();

  const inputRef = useRef<HTMLInputElement>(null);
  const { isAndroid } = getMobileDeviceInfo();
  const postMessage = usePostAppMessage();

  // 앱에서 파일 선택 완료 시 호출되는 콜백
  const handleFileSelected = async (data: FileSelectedData) => {
    const result = await processImageFromApp(data, (message) => openToast({ message }));

    if (result) {
      setNoteInfo((prevNoteInfo) => ({
        ...prevNoteInfo,
        images: [result],
      }));
    }
  };

  // 앱에서 파일 선택 이벤트 리스닝
  useGetAppMessage({
    key: 'FILE_SELECTED',
    cb: handleFileSelected,
  });

  const onClickAdd = () => {
    /* 안드로이드의 경우 권한 문제로 앨범 사진 선택, 카메라 촬영 메뉴 별도 표시 */
    if (isAndroid) {
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
    postMessage('OPEN_CAMERA', {});
  };

  const handleOpenAlbum = () => {
    postMessage('OPEN_GALLERY', {});
  };

  const closePhotoUploadBottomSheet = () => {
    setShowPhotoUploadBottomSheet(false);
  };

  const onImageAdd = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const image = e.target.files[0];
    try {
      const imageDataUrl = await readFile(image);

      if (typeof imageDataUrl !== 'string') {
        throw new Error('read file error');
      }
      setEditImageUrl(imageDataUrl);
      setIsEditVisible(true);
    } catch (error) {
      openToast({
        message: (error as Error).message,
      });
    }
  };

  const handleChangeVisibility = (e: ChangeEvent<HTMLInputElement>) => {
    const newVisibility = e.target.value as PostVisibility;
    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      visibility: newVisibility,
    }));
  };

  const onCompleteImageCrop = (croppedImage: CroppedImg) => {
    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      images: [croppedImage],
    }));
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

  return (
    <>
      <Layout.FlexCol w="100%" ph={DEFAULT_MARGIN} pv={12} gap={16}>
        <Layout.FlexRow w="100%" alignItems="center" gap={8} pv={8}>
          <ProfileImage
            imageUrl={myProfile?.profile_image}
            username={myProfile?.username}
            size={50}
          />
          <Typo type="title-medium">{myProfile?.username}</Typo>
        </Layout.FlexRow>
        <NoteInput
          value={noteInfo.content}
          placeholder={t('notes.whats_on_your_mind') || ''}
          onChange={handleChangeInput}
        />
        <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="flex-start">
          <SvgIcon name="chat_media_image" size={24} onClick={onClickAdd} fill="DARK_GRAY" />
          {/** visibility options */}
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
                labelType="label-large"
                buttonSize="small"
              />
              <RadioButton
                label={t('access_setting.close_friend') || ''}
                name="close_friends"
                value="close_friends"
                checked={visibility === 'close_friends'}
                onChange={handleChangeVisibility}
                labelType="label-large"
                buttonSize="small"
              />
            </Layout.FlexCol>
          </Layout.FlexCol>
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
      {noteInfo?.images && noteInfo.images.length > 0 && (
        <NoteImageWrapper ph={DEFAULT_MARGIN}>
          {noteInfo.images[0] && noteInfo.images[0].url && (
            <NoteImage src={noteInfo.images[0].url} alt="Note image" />
          )}
          <Layout.Absolute t={0} r={15}>
            <SvgIcon name="delete_image" size={50} onClick={handleDeleteImage} />
          </Layout.Absolute>
        </NoteImageWrapper>
      )}
      <FlexRow w="100%" justifyContent="flex-end" alignItems="center" ph={DEFAULT_MARGIN}>
        <Typo type="label-medium" color="MEDIUM_GRAY" mt={8}>
          {t('notes.content_restriction')}
        </Typo>
      </FlexRow>
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
