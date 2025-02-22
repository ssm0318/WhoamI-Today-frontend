import React, { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, SvgIcon, Typo } from '@design-system';
import { useGetAppMessage, usePostAppMessage } from '@hooks/useAppMessage';
import { NewNoteForm } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import NewNoteImageEdit from '../new-note-image-edit/NewNoteImageEdit';
import { NoteImage, NoteImageWrapper } from '../note-image/NoteImage.styled';
import { NoteInput } from './NoteInputBox.styled';

interface NoteInformationProps {
  noteInfo: NewNoteForm;
  setNoteInfo: React.Dispatch<React.SetStateAction<NewNoteForm>>;
}

function NewNoteContent({ noteInfo, setNoteInfo }: NoteInformationProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const [isEditVisible, setIsEditVisible] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState<string>();
  const postMessage = usePostAppMessage();

  const inputRef = useRef<HTMLInputElement>(null);

  const onClickAdd = () => {
    if (noteInfo.images && noteInfo.images.length < 10) inputRef.current?.click();
    // TODO: exception message
    else console.log('exceed 10 images');
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

  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  const sendCameraPermissionRequest = () => {
    postMessage('CAMERA_PERMISSION', {});
  };

  const handleClickImageInput = async () => {
    sendCameraPermissionRequest();
  };

  const handleCameraPermissionResult = (data: boolean) => {
    console.log('Camera permission result:', data);
    if (data) {
      console.log('Permission granted');
      // 권한이 허용되면 파일 선택창 열기
      inputRef.current?.click();
    } else {
      console.log('Permission denied');
      openToast({
        message: t('permission_denied_message'), // 사용자에게 권한 거부 알림
      });
    }
  };

  useGetAppMessage({
    cb: ({ value }) => {
      handleCameraPermissionResult(value);
    },
    key: 'CAMERA_PERMISSION_RESULT',
  });

  return (
    <>
      <Layout.FlexCol w="100%" ph={DEFAULT_MARGIN} mt={TITLE_HEADER_HEIGHT} pv={12} gap={16}>
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
          placeholder={`${t('whats_on_your_mind')}\n\n${t('content_restriction')}`}
          onChange={handleChangeInput}
        />
        <SvgIcon name="chat_media_image" size={24} onClick={onClickAdd} fill="DARK_GRAY" />
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg, image/png"
          onChange={onImageAdd}
          onClick={handleClickImageInput}
          multiple={false}
          style={{ display: 'none' }}
        />
      </Layout.FlexCol>
      {isEditVisible ? (
        <NewNoteImageEdit
          imageUrl={editImageUrl}
          setIsVisible={setIsEditVisible}
          onCompleteImageCrop={onCompleteImageCrop}
        />
      ) : noteInfo?.images?.length ? (
        <NoteImageWrapper ph={DEFAULT_MARGIN}>
          {noteInfo.images[0] && <NoteImage src={noteInfo.images[0].url} />}
          <Layout.Absolute t={0} r={15}>
            <SvgIcon name="delete_image" size={50} onClick={handleDeleteImage} />
          </Layout.Absolute>
        </NoteImageWrapper>
      ) : null}
    </>
  );
}

export default NewNoteContent;
