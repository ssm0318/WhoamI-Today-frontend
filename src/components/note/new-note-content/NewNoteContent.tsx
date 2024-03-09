import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { DEFAULT_MARGIN, TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Font, Layout, SvgIcon } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { readFile } from '@utils/getCroppedImg';
import NewNoteImage from '../new-note-image/NewNoteImage';
import { NoteInput } from './NoteInputBox.styled';

function NewNoteContent() {
  const [t] = useTranslation('translation', { keyPrefix: 'notes' });
  const PLACE_HOLDER = t('whats_on_your_mind');

  const [inputValue, setInputValue] = useState<string>();
  const [noteImages, setNoteImages] = useState<string[]>([]);

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

      setNoteImages((images) => [...images, imageDataUrl]);
    } catch (error) {
      // TODO
      console.error(error);
    }
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
    <Layout.FlexRow w="100%" ph={DEFAULT_MARGIN} mt={TITLE_HEADER_HEIGHT} pv={12} gap={16}>
      <ProfileImage imageUrl={myProfile?.profile_image} username={myProfile?.username} size={50} />
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
        {/* TODO: 좌우 스크롤 가능한 상위컴포넌트 추가 */}
        {noteImages?.map((imgurl) => {
          return <NewNoteImage url={imgurl} />;
        })}
      </Layout.FlexCol>
    </Layout.FlexRow>
  );
}

export default NewNoteContent;
