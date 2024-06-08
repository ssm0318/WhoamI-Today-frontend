import React, { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ImageSlider from '@components/_common/image-slider/ImageSlider';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import NoteImageEdit from '@components/note/note-image-edit/NoteImageEdit';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout, SvgIcon, Typo } from '@design-system';
import { NewNoteForm } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import { NoteInput } from './NoteInputBox.styled';

interface NoteInformationProps {
  noteInfo: NewNoteForm;
  setNoteInfo: React.Dispatch<React.SetStateAction<NewNoteForm>>;
}

function NewNoteContent({ noteInfo, setNoteInfo }: NoteInformationProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });
  const PLACE_HOLDER = t('whats_on_your_mind');
  const { openToast } = useBoundStore((state) => ({ openToast: state.openToast }));

  const [isEditVisible, setIsEditVisible] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState<string>();

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
      images: [...(prevNoteInfo?.images || []), croppedImage],
    }));
  };

  const handleDeleteImage = (imgIndex: number) => {
    if (!noteInfo.images) return;

    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      images: prevNoteInfo?.images?.filter((image, index) => index !== imgIndex) || [],
    }));
  };

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      content: e.target.value,
    }));
  };

  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

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
          placeholder={PLACE_HOLDER}
          onChange={handleChangeInput}
        />
        <SvgIcon name="chat_media_image" size={24} onClick={onClickAdd} fill="DARK_GRAY" />
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg, image/png"
          onChange={onImageAdd}
          multiple={false}
          style={{ display: 'none' }}
        />
      </Layout.FlexCol>
      {isEditVisible ? (
        <NoteImageEdit
          image={editImageUrl}
          setIsVisible={setIsEditVisible}
          onCompleteImageCrop={onCompleteImageCrop}
        />
      ) : noteInfo?.images?.length ? (
        <Layout.FlexCol alignItems="center" w="100%">
          <ImageSlider
            images={noteInfo.images.map((img) => img.url)}
            rounded={17}
            onDeleteImage={handleDeleteImage}
          />
        </Layout.FlexCol>
      ) : null}
    </>
  );
}

export default NewNoteContent;
