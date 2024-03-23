import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import NoteImageEdit from '@components/note/note-image-edit/NoteImageEdit';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { CroppedImg, readFile } from '@utils/getCroppedImg';
import 'swiper/css';
// eslint-disable-next-line import/order
import { Swiper, SwiperSlide } from 'swiper/react';
import NewNoteImage from '../new-note-image/NewNoteImage';
import { NoteInput } from './NoteInputBox.styled';

function NewNoteContent() {
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });
  const PLACE_HOLDER = t('whats_on_your_mind');

  const [inputValue, setInputValue] = useState<string>();
  const [noteImages, setNoteImages] = useState<string[]>([]);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState<string>();

  const inputRef = useRef<HTMLInputElement>(null);

  const onClickAdd = () => {
    inputRef.current?.click();
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
    // setSignUpInfo({ profileImage: croppedImage.file });
    // setProfileImagePreview(croppedImage.url);
    setNoteImages((images) => [...images, croppedImage.url]);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDownInput = (e: KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
    if (e.shiftKey) return;

    e.preventDefault();
    // sendPost();
  };

  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));

  return (
    <>
      {/* <NewNoteHeader title={t('new_note_header.new_note')} /> */}
      <Layout.FlexRow w="100%" ph={DEFAULT_MARGIN} mt={TITLE_HEADER_HEIGHT} pv={12} gap={16}>
        <ProfileImage
          imageUrl={myProfile?.profile_image}
          username={myProfile?.username}
          size={50}
        />
        <Layout.FlexCol w="100%" gap={8} pv={8}>
          <Font.Body type="16_semibold">{myProfile?.username}</Font.Body>
          <NoteInput
            value={inputValue}
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
          initialSlide={noteImages.length - 1}
        >
          {noteImages?.map((imgurl) => {
            return (
              <SwiperSlide>
                <NewNoteImage url={imgurl} noteImages={noteImages} setNoteImages={setNoteImages} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </>
  );
}

export default NewNoteContent;
