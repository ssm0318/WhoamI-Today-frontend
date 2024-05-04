import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import NoteImageEdit from '@components/note/note-image-edit/NoteImageEdit';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';
import { Note } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import NewNoteImage from '../new-note-image/NewNoteImage';
import { NoteInput } from './NoteInputBox.styled';

interface NoteInformationProps {
  noteInfo: Partial<Note>;
  setNoteInfo: React.Dispatch<React.SetStateAction<Partial<Note>>>;
}

function NewNoteContent({ noteInfo, setNoteInfo }: NoteInformationProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });
  const PLACE_HOLDER = t('whats_on_your_mind');

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
      // TODO
      console.error(error);
    }
  };

  const onCompleteImageCrop = (croppedImage: CroppedImg) => {
    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      images: [...(prevNoteInfo?.images || []), croppedImage.url],
    }));
  };

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNoteInfo((prevNoteInfo) => ({
      ...prevNoteInfo,
      content: e.target.value,
    }));
  };

  const handleKeyDownInput = (e: KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
    if (e.shiftKey) return;

    e.preventDefault();
  };

  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  return (
    <>
      <Layout.FlexRow w="100%" ph={DEFAULT_MARGIN} mt={TITLE_HEADER_HEIGHT} pv={12} gap={16}>
        <ProfileImage
          imageUrl={myProfile?.profile_image}
          username={myProfile?.username}
          size={50}
        />
        <Layout.FlexCol w="100%" gap={8} pv={8}>
          <Font.Body type="16_semibold">{myProfile?.username}</Font.Body>
          <NoteInput
            value={noteInfo.content}
            placeholder={PLACE_HOLDER}
            onChange={handleChangeInput}
            onKeyDown={handleKeyDownInput}
          />
          <SvgIcon name="chat_media_image" size={30} onClick={onClickAdd} />
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg, image/png"
            onChange={onImageAdd}
            multiple={false}
            style={{ display: 'none' }}
          />
        </Layout.FlexCol>
      </Layout.FlexRow>
      {isEditVisible ? (
        <NoteImageEdit
          image={editImageUrl}
          setIsVisible={setIsEditVisible}
          onCompleteImageCrop={onCompleteImageCrop}
        />
      ) : (
        <Swiper
          style={{
            height: '300px',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          slidesPerView={1}
          initialSlide={noteInfo.images && noteInfo.images.length - 1}
        >
          {noteInfo.images?.map((imgurl) => {
            return (
              <SwiperSlide key={imgurl}>
                <NewNoteImage url={imgurl} noteImages={noteInfo.images} setNoteInfo={setNoteInfo} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </>
  );
}

export default NewNoteContent;
